""" Issues context processor """
from .models import Issue

def issues(request):
    context = {
        'issues': {
            'latest': Issue.objects.latest_issue(),
            'next': Issue.objects.next_issue(),
        }
    }
    return context

