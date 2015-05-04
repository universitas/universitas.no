from django import shortcuts
# from django.db.models import Q

from apps.stories.models import Story
from apps.contributors.models import Contributor
from apps.photo.models import ImageFile


def autocomplete_list(request):
    template_name = 'autocomplete_list.html'
    q = request.GET.get('q', '')
    results = []
    models = [
        (Story, 'title', 10),
        (Contributor, 'display_name', 6),
        (ImageFile, 'source_file', 6),
    ]
    for model, field, limit in models:
        kwargs = {field + '__icontains': q}
        query = model.objects.filter(**kwargs)[:limit]
        if query:
            results.append({
                'name': model.__name__,
                'items': query,
                'change': 'admin:{app}_{object}_change'.format(
                    app=model._meta.app_label,
                    object=model._meta.model_name,
                ),
            })

    return shortcuts.render(request, template_name, {'models': results})
