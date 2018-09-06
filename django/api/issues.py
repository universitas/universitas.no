from rest_framework import filters, pagination, serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend

from apps.issues.models import Issue, PrintIssue
from utils.serializers import AbsoluteURLField


class NestedPDFSerializer(serializers.ModelSerializer):

    cover = AbsoluteURLField(source='get_cover_page.url')

    class Meta:
        model = PrintIssue
        fields = [
            'url',
            'pages',
            'cover',
            'pdf',
        ]


class IssueSerializer(serializers.HyperlinkedModelSerializer):
    """ModelSerializer for Issue"""

    pdfs = NestedPDFSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Issue
        fields = [
            'id',
            'url',
            'publication_date',
            'year',
            'issue_name',
            'pdfs',
            'issue_type',
        ]


class LargeLimitPagination(pagination.LimitOffsetPagination):
    default_limit = 1000


class IssueViewSet(viewsets.ModelViewSet):
    """ API endpoint that allows Issue to be viewed or updated.  """

    filter_fields = ['id', 'publication_date', 'pdfs']
    queryset = Issue.objects.all().prefetch_related('pdfs')
    serializer_class = IssueSerializer
    pagination_class = LargeLimitPagination
    filter_backends = (
        filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend
    )
    search_fields = ['issue_name']


class PrintIssueSerializer(serializers.HyperlinkedModelSerializer):
    """ModelSerializer for PrintIssue"""

    cover = AbsoluteURLField(source='get_cover_page.url')

    class Meta:
        model = PrintIssue
        fields = [
            'url',
            'issue',
            'pages',
            'cover',
            'pdf',
        ]


class PrintIssueViewSet(viewsets.ModelViewSet):
    """ API endpoint that allows PrintIssue to be viewed or updated.  """

    queryset = PrintIssue.objects.order_by('-issue__publication_date')
    serializer_class = PrintIssueSerializer
    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
