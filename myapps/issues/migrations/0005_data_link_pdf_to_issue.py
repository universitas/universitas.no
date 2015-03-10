# -*- coding: utf-8 -*-

from django.db import migrations


def join_models(apps, schema_editor):

    Issue = apps.get_model('issues', 'Issue')
    PrintIssue = apps.get_model('issues', 'PrintIssue')

    for piss in PrintIssue.objects.all():
        piss.issue, _ = Issue.objects.get_or_create(
            publication_date=piss.publication_date,
        )
        piss.save()


def unjoin_models(apps, schema_editor):

    PrintIssue = apps.get_model('issues', 'PrintIssue')

    for piss in PrintIssue.objects.all():
        piss.issue.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0004_printissue_issue'),
    ]

    operations = [
        migrations.RunPython(
            join_models,
            reverse_code=unjoin_models
        ),
    ]
