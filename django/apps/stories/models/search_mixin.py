from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import (
    SearchQuery, SearchRank, SearchVector, SearchVectorField, TrigramSimilarity
)
from django.db.models import FloatField  # Manager,
from django.db.models import ExpressionWrapper, F, Func, Model, QuerySet


class LogAge(Func):
    """Calculate log 10 of hours since datetime column"""
    arity = 1
    # Accept only single field as input `expressions`
    MIN_AGE = 2.0
    # Minimum age 2 hours. Prevent log of zero error and unintended large
    # effect of log of very small inputs.

    template = (
        f'log(greatest({MIN_AGE},'
        'extract(epoch FROM (now() - %(expressions)s))'
        '/ (60 * 60)))::real'
    )

    # PostgreSQL query explanation:

    # log(greatest(x, y))
    # base 10 logarithm of largest number of x and y

    # extract(epoch FROM (now() - then))
    # Extract total seconds from timedelta `now - then`
    # `epoch` = 1970-01-01 = unix epoch = total seconds

    # / (60 * 60)
    # Divide by minutes and seconds: seconds -> hours

    # ::real
    #  Cast result as `real` using PostgreSQL type cast notation
    # `real` = 32 bits floating point number


class FullTextSearchQuerySet(QuerySet):
    """Queryset mixin for performing search and indexing for the Story model"""
    config = 'norwegian'
    vector = (
        SearchVector(
            'working_title',
            'title',
            'kicker',
            'theme_word',
            weight='A',
            config=config,
        ) + SearchVector(
            'lede',
            weight='B',
            config=config,
        ) + SearchVector(
            'bodytext_markup',
            weight='C',
            config=config,
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
        return self.with_search_rank(query).with_age('created').annotate(
            rank=ExpressionWrapper(F('search_rank') / F('age'), FloatField())
        ).order_by('-rank')

    def with_search_rank(self, query):
        search = SearchQuery(query, config=self.config)
        return self.filter(
            search_vector=search,
        ).annotate(
            search_rank=SearchRank(F('search_vector'), search),
        )

    def with_age(self, field='created'):
        return self.annotate(age=LogAge(field))

    def update_search_vector(self):
        """Calculate and store search vector in the database."""
        self.update(search_vector=self.vector)


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
