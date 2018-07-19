"""Related stories"""

from django.db import models
from django.utils.translation import ugettext_lazy as _


class RelatedStoriesMixin(models.Model):
    class Meta:
        abstract = True

    related_stories = models.ManyToManyField(
        'stories.Story',
        verbose_name=_('related stories'),
    )

    def find_related_stories(self, number=5, save=True):
        """Finds related stories."""
        others = self.__class__.objects.published().filter(
            language=self.language
        ).exclude(id=self.id).with_age(
            when=self.publication_date or self.created,
            field='publication_date',
        ).order_by('age')
        linked = self.inline_links.values_list('linked_story', flat=True)
        related = list(others.filter(pk__in=linked))
        if self.theme_word:
            related += list(others.filter(theme_word=self.theme_word)[:number])
        if len(related) < number:
            related += list(others.filter(story_type=self.story_type)[:number])
        if len(related) < number:
            related += list(
                others.filter(story_type__section=self.story_type.section,
                              )[:number]
            )
        if len(related) < number:
            related += list(others[:number])
        if save:
            self.related_stories.add(*related[:number])

        return related[:number]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_published() and self.related_stories.count() == 0:
            self.find_related_stories()
