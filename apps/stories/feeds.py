"""RSS Feeds"""
from django.contrib.syndication.views import Feed
from .models import Story


class LatestStories(Feed):
    title = "Universitas: Nyeste saker"
    link = "/rss/"
    description = "Nyeste publiserte saker fra universitas.no"

    def items(self):
        return Story.objects.published().order_by('-publication_date')[:10]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.lede
