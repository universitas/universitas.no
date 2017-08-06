from apps.issues.models import Issue, PrintIssue
from rest_framework import serializers, viewsets, filters, pagination
from django_filters.rest_framework import DjangoFilterBackend


class NestedPDFSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrintIssue
        fields = [
            'url',
            'pages',
            'cover_page',
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
            'number',
            'pdfs',
            'issue_type',
        ]


class LargeLimitPagination(pagination.LimitOffsetPagination):
    default_limit = 1000


class IssueViewSet(viewsets.ModelViewSet):

    """
    API endpoint that allows Issue to be viewed or updated.
    """

    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    pagination_class = LargeLimitPagination


class PrintIssueSerializer(serializers.HyperlinkedModelSerializer):

    """ModelSerializer for PrintIssue"""

    class Meta:
        model = PrintIssue
        fields = [
            'url',
            'issue',
            'pages',
            'cover_page',
            'pdf',
        ]


class PrintIssueViewSet(viewsets.ModelViewSet):

    """
    API endpoint that allows PrintIssue to be viewed or updated.
    """

    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    queryset = PrintIssue.objects.order_by('-issue__publication_date')
    serializer_class = PrintIssueSerializer
