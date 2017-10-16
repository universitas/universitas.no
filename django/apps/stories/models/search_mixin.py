from django.contrib.postgres.indexes import GinIndex
# from django.db.models.expressions import RawSQL
from django.contrib.postgres.search import (
    SearchQuery, SearchRank, SearchVector, SearchVectorField, TrigramSimilarity
)
from django.db.models import (
    ExpressionWrapper,
    F,
    FloatField,  # Manager,
    Func,
    Model,
    QuerySet
)


class LogAge(Func):
    """Convert a datetime field to log10 of hours since then."""
    arity = 1
    template = (
        'log(greatest(2.0,'
        'extract(epoch FROM (now() - %(expressions)s))'
        '/ (60.0 * 60)))::real'
    )


class FullTextSearchQuerySet(QuerySet):
    # config = None  # 'norwegian'
    config = 'norwegian'
    vector = (
        SearchVector(
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
        qs = self.annotate(rank=TrigramSimilarity(lookup_field, query))
        qs = qs.exclude(rank__lt=cutoff)
        return qs.order_by('-rank')

    def search(self, query):
        return self.with_search_rank(query).with_age('created').annotate(
            rank=ExpressionWrapper(F('search_rank') / F('age'), FloatField())
        ).order_by('-rank')

    def with_search_rank(self, query):
        search = SearchQuery(query, config=self.config)
        return self.filter(search_vector=search).annotate(
            search_rank=SearchRank(F('search_vector'), search)
        )

    def with_age(self, field='created'):
        return self.annotate(age=LogAge(field))

    def update_search_vector(self):
        self.update(search_vector=self.vector)


class FullTextSearchMixin(Model):

    search_vector = SearchVectorField(null=True)

    class Meta:
        indexes = [GinIndex(fields=['search_vector'])]
        abstract = True
