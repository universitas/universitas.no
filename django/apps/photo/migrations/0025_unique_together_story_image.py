from collections import Counter

import sorl.thumbnail.fields

import apps.photo.models
from django.db import migrations
from utils.merge_model_objects import merge_instances


def dedupe_storyimages(apps, schema_editor):
    """merge storyimages with same parent_story/imagefile."""
    StoryImage = apps.get_model("stories", "StoryImage")
    pairs = StoryImage.objects.values_list('imagefile_id', 'parent_story_id')
    dupes = (key for key, val in Counter(pairs).items() if val > 1)
    for imagefile, parent_story in dupes:
        story_images = StoryImage.objects.filter(
            imagefile=imagefile,
            parent_story=parent_story,
        ).order_by('-top', 'index')
        merge_instances(*story_images)


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0024_auto_20180421_1957'),
    ]

    operations = [
        migrations.RunPython(
            code=dedupe_storyimages,
            reverse_code=migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='original',
            field=sorl.thumbnail.fields.ImageField(
                height_field='full_height',
                max_length=1024,
                null=True,
                upload_to=apps.photo.models.upload_image_to,
                verbose_name='original',
                width_field='full_width'
            ),
        ),
    ]
