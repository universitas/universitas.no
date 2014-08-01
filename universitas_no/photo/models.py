from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from contributors.models import Contributor

# Create your models here.

class ImageFile(models.Model):
    # TODO: Define fields here

    class Meta:
        verbose_name = _('ImageFile')
        verbose_name_plural = _('ImageFiles')

    source_file = models.ImageField(
        upload_to='INCOMING',
        height_field='full_height',
        width_field='full_width',
        max_length=100,
        )

    old_file_path = models.CharField(
        help_text=_('previous path if the image has been moved.'),
        blank=True, null=True,
        max_length=100)

    def __unicode__(self):
        return '{}'.format(self.source_file)

    # def thumb(self):
        # TODO: Thumbnail-function. Det er nok bedre å bruke en tredjepart-app.

    # def save(self):
        # pass

class Image(TimeStampedModel):

    class Meta:
        verbose_name = _('Image')
        verbose_name_plural = _('Images')

    image_file = models.ForeignKey(ImageFile)
    photographer = models.ForeignKey(Contributor)


    @models.permalink
    def get_absolute_url(self):
        return ('')


