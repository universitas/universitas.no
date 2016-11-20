# -*- coding: utf-8 -*-
from django.core import serializers

def load_fixture(fixture_file):
    def _load(apps, schema_editor):
        original_apps = serializers.python.apps
        serializers.python.apps = apps
        try:
            with open(fixture_file) as fixture:
                objects = serializers.deserialize(
                    'json', fixture, ignorenonexistent=True)
                for obj in objects:
                    obj.save()
        finally:
            serializers.python.apps = original_apps

    return _load

def unload_fixture(appname, models=[]):
    def _unload(apps, schema_editor):
        """Brutally deleting all entries for this model..."""
        for modelname in models:
            model = apps.get_model(appname, modelname)
            model.objects.all().delete()
    return _unload
