from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
    SearchVector,
    SearchVectorField,
)
from django.db.models import (
    Case,
    ExpressionWrapper,
    F,
    FloatField,
    Model,
    QuerySet,
    Value,
    When,
)
from django.db.models.functions import Concat
from django.utils.timezone import now

from utils.dbfuncs import LogAge, TrigramWordSimilarity


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
        return result.with_age('publication_date').annotate(
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
