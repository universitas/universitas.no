from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
    SearchVector,
    SearchVectorField,
    TrigramSimilarity,
)
from django.db.models import (
    Case,
    CharField,
    ExpressionWrapper,
    F,
    FloatField,
    Func,
    Model,
    QuerySet,
    Value,
    When,
)
from django.db.models.functions import Concat
from django.utils.timezone import now


class TrigramWordSimilarity(Func):
    output_field = FloatField()
    function = 'WORD_SIMILARITY'

    def __init__(self, expression, string, **extra):
        if not hasattr(string, 'resolve_expression'):
            string = Value(string)
        super().__init__(string, expression, **extra)


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

    def search(self, query):
        if not isinstance(query, str):
            msg = f'expected query to be str, got {type(query)}, {query!r}'
            raise ValueError(msg)
        result = None
        if len(query) > 5:
            result = self.search_vector_rank(query)
        if not result:
            result = self.trigram_search_rank(query)
        return result.with_age('created').annotate(
            combined_rank=ExpressionWrapper(
                F('rank') / F('age'), FloatField()
            )
        ).order_by('-combined_rank')

    def with_age(self, field='created', when=None):
        if when is None:
            when = now()
        return self.annotate(
            age=LogAge(
                when=when, timefield=field, table=self.model._meta.db_table
            )
        )

    def trigram_search_rank(self, query, cutoff=None):
        """Perform postgresql trigram word similarity lookup"""

        # stricter cutoff for short queries
        if cutoff is None:
            cutoff = 1 - min(5, len(query)) / 10

        head = Concat(
            F('working_title'), Value(' '), F('kicker'), Value(' '),
            F('title'), Value(' '), F('lede')
        )
        ranker = TrigramWordSimilarity(head, query)
        return self.annotate(rank=ranker).filter(rank__gt=cutoff)

    def search_vector_rank(self, query, cutoff=0.2):
        """Perform postgresql full text search using search vector."""
        ranker = SearchRank(
            F('search_vector'), SearchQuery(query, config=self.config)
        )
        return self.annotate(rank=ranker).filter(rank__gt=cutoff)

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
