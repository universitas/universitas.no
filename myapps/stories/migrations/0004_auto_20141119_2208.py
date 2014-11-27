# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0003_inlinelink_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inlinelink',
            name='status_code',
            field=models.CharField(verbose_name='http status code', default='', editable=False, max_length=3, choices=[('', 'Not checked yet'), ('DNS', 'DNS lookup error'), ('URL', 'Malformed http url'), ('INT', 'Internal link'), ('200', '200 OK'), ('403', '403 Forbidden'), ('404', '404 Not Found'), ('408', '408 Request Timeout'), ('410', '410 Gone'), ('418', "418 I'm a teapot (RFC 2324)"), ('500', '500 Internal Server Error')], help_text='Status code returned from automatic check.'),
        ),
    ]
