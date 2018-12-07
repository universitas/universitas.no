from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import (
    SearchQuery, SearchRank, SearchVector, SearchVectorField, TrigramSimilarity
)
from django.db.models import FloatField  # Manager,
from django.db.models import (
    Case, ExpressionWrapper, F, Func, Model, QuerySet, Value, When
)
from django.utils.timezone import now


class LogAge(Func):
    """Calculate log 10 of hours since datetime column"""
    MIN_AGE = 2.0
    # Minimum age 2 hours. Prevent log of zero error and unintended large
    # effect of log of very small inputs.
    output_field = FloatField()

    template = (
        f'log(greatest({MIN_AGE},'
        'abs(extract(epoch FROM (TIMESTAMP '
        "'%(when)s' - %(table)s.%(timefield)s)))"
        '/ (60 * 60)))::real'
    )

    # PostgreSQL query explanation:

    # log(greatest(x, y))
    # base 10 logarithm of largest number of x and y

    # @ extract(epoch FROM (when - then))
    # Extract total seconds from timedelta `now - then`
    # `epoch` = 1970-01-01 = unix epoch = total seconds
    # @ is absolute number math operator

    # / (60 * 60)
    # Divide by minutes and seconds: seconds -> hours

    # ::real
    #  Cast result as `real` using PostgreSQL type cast notation
    # `real` = 32 bits floating point number


class FullTextSearchQuerySet(QuerySet):
    """Queryset mixin for performing search and indexing for the Story model"""
    config = 'norwegian'
    case_config = Case(
        When(language='en', then=Value('english')), default=Value(config)
    )
    vector = (
        SearchVector(
            'working_title',
            'title',
            'kicker',
            'theme_word',
            weight='A',
            config=case_config,
        ) + SearchVector(
            'lede',
            weight='B',
            config=case_config,
        ) + SearchVector(
            'bodytext_markup',
            weight='C',
            config=case_config,
        )
    )

    def trigram_search(self, query, lookup_field='title', cutoff=0.2):
        """Perform postgresql trigram similarity lookup
        https://docs.djangoproject.com/en/2.0/ref/contrib/postgres/search/
        """
        return self.annotate(
            rank=TrigramSimilarity(lookup_field, query),
        ).exclude(rank__lt=cutoff).order_by('-rank')

    def search(self, query):
        """Perform postgresql full text search using search vector."""
        qs = self.with_age('created')
        result = qs.with_search_rank(query).annotate(
            rank=ExpressionWrapper(F('search_rank') / F('age'), FloatField())
        ).order_by('-rank')
        if result:
            return result
        # fallback to title trigram search
        return qs.trigram_search(query).order_by('-age')

    def with_search_rank(self, query):
        if not isinstance(query, str):
            msg = f'expected query to be str, got {type(query)}, {query!r}'
            raise ValueError(msg)
        term, *terms = query.split()
        search = SearchQuery(term, config=self.config)
        for term in terms:
            search &= SearchQuery(word, config=self.config)
        return self.filter(
            search_vector=search,
        ).annotate(
            search_rank=SearchRank(F('search_vector'), search),
        )

    def with_age(self, field='created', when=None):
        if when is None:
            when = now()
        return self.annotate(
            age=LogAge(
                when=when, timefield=field, table=self.model._meta.db_table
            )
        )

    def update_search_vector(self):
        """Calculate and store search vector in the database."""
        return self.update(search_vector=self.vector)


class FullTextSearchMixin(Model):

    search_vector = SearchVectorField(
        editable=False,
        null=True,
    )

    class Meta:
        indexes = [
            # Create database index for search vector for improved performance
            GinIndex(fields=['search_vector']),
        ]
        abstract = True
