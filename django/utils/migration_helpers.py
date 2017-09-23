from django.core import serializers
from django.db import connection


def reset_primary_key_index(table, pk="id"):
    """Sets the postgres primary key index to one larger than max"""
    with connection.cursor() as cursor:
        cursor.execute((
            'SELECT'
            ' setval(pg_get_serial_sequence(\'"{table}"\', \'{pk}\'),'
            ' coalesce(max("{pk}"), 1), max("{pk}") IS NOT null)'
            ' FROM "{table}";'
        ).format(table=table, pk=pk))


def load_fixture(fixture_file):
    """load all items from fixture file"""

    def _load(apps, schema_editor):
        original_apps = serializers.python.apps
        serializers.python.apps = apps
        tables = set()
        try:
            with open(fixture_file) as fixture:
                objects = serializers.deserialize(
                    'json', fixture, ignorenonexistent=True
                )
                for obj in objects:
                    obj.save()
                    tables.add(obj.object._meta.db_table)
        finally:
            serializers.python.apps = original_apps
        for table in tables:
            reset_primary_key_index(table)

    return _load


def unload_fixture(appname, models=()):
    def _unload(apps, schema_editor):
        """Brutally deleting all entries for this model..."""
        for modelname in models:
            model = apps.get_model(appname, modelname)
            model.objects.all().delete()
            reset_primary_key_index(model._meta.db_table)

    return _unload
