import django.core.validators
import django.utils.timezone
import model_utils.fields
import sorl.thumbnail.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageFile',
            fields=[
                (
                    'id', models.AutoField(
                        serialize=False,
                        verbose_name='ID',
                        auto_created=True,
                        primary_key=True
                    )
                ),
                (
                    'created', model_utils.fields.AutoCreatedField(
                        verbose_name='created',
                        editable=False,
                        default=django.utils.timezone.now
                    )
                ),
                (
                    'modified', model_utils.fields.AutoLastModifiedField(
                        verbose_name='modified',
                        editable=False,
                        default=django.utils.timezone.now
                    )
                ),
                (
                    'source_file', sorl.thumbnail.fields.ImageField(
                        upload_to='',
                        max_length=1024,
                        width_field='full_width',
                        height_field='full_height'
                    )
                ),
                (
                    'full_height', models.PositiveIntegerField(
                        verbose_name='full height',
                        editable=False,
                        help_text='full height in pixels'
                    )
                ),
                (
                    'full_width', models.PositiveIntegerField(
                        verbose_name='full height',
                        editable=False,
                        help_text='full height in pixels'
                    )
                ),
                (
                    'from_top', models.PositiveSmallIntegerField(
                        default=50,
                        help_text='image crop vertical. Between 0% and 100%.',
                        validators=[
                            django.core.validators.MaxValueValidator(100),
                            django.core.validators.MinValueValidator(0)
                        ]
                    )
                ),
                (
                    'from_left', models.PositiveSmallIntegerField(
                        default=50,
                        help_text='image crop horizontal. Between 0% and 100%.',
                        validators=[
                            django.core.validators.MaxValueValidator(100),
                            django.core.validators.MinValueValidator(0)
                        ]
                    )
                ),
                (
                    'cropping_method', models.PositiveSmallIntegerField(
                        default=0,
                        help_text='How this image has been cropped.',
                        choices=[(0, 'center'), (5, 'feature detection'),
                                 (10, 'face detection'), (100, 'manual crop')]
                    )
                ),
                (
                    'old_file_path', models.CharField(
                        blank=True,
                        max_length=1000,
                        null=True,
                        help_text='previous path if the image has been moved.'
                    )
                ),
                (
                    'copyright_information', models.CharField(
                        blank=True,
                        max_length=1000,
                        null=True,
                        help_text=
                        'extra information about license and attribution if needed.'
                    )
                ),
                (
                    'contributor', models.ForeignKey(
                        on_delete=models.CASCADE,
                        null=True,
                        help_text='who made this',
                        blank=True,
                        to='contributors.Contributor'
                    )
                ),
            ],
            options={
                'verbose_name': 'ImageFile',
                'verbose_name_plural': 'ImageFiles',
            },
            bases=(models.Model, ),
        ),
    ]
