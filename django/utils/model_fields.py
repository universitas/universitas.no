import json

from apps.photo.cropping.boundingbox import CropBox
from django.contrib.postgres.fields import JSONField
from django.core.exceptions import ValidationError
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models


def parse_box_data(value):
    try:
        data = json.loads(value)
        return CropBox(**data)
    except json.JSONDecodeError:
        return CropBox.basic()
    except ValueError:
        return CropBox.basic()


def validate_box(value):
    try:
        CropBox(**value.__dict__)
    except ValueError as err:
        raise ValidationError(str(err))


class BoxField(models.Field):
    description = 'Bounding Box field'
    default_validators = [validate_box]

    def __init__(self, *args, default=CropBox.basic, **kwargs):
        return super().__init__(*args, default=default, **kwargs)

    def from_db_value(self, value, expression, connection, context):
        if value is None:
            return value
        return parse_box_data(value)

    def to_python(self, value):
        if isinstance(value, CropBox):
            return value
        if value is None:
            return value
        return parse_box_data(value)

    def value_to_string(self, obj):
        value = self.value_from_object(obj)
        return self.get_prep_value(value)

    def get_prep_value(self, value):
        if value is None:
            return ''
        validate_box(value)
        return json.dumps(value.serialize())

    def get_internal_type(self):
        return 'TextField'


class AttrDict(dict):
    """Dictionary that supports attribute dot lookup (not nested)"""

    def is_valid_name(self, name):
        # blacklist attributes used for some internal django magic
        # in django.db.models.sql.compiler
        return name not in {'resolve_expression', 'prepare_database_save'}

    def __setattr__(self, name, value):
        if self.is_valid_name(name):
            self[name] = value
        else:
            super().__setattr__(name, value)

    def __getattr__(self, name):
        if self.is_valid_name(name):
            return self.get(name, None)
        else:
            return super().__getattr___(name)

    def __dir__(self):
        return list(self.keys())


class AttrJSONField(JSONField):
    """JSON field with getattrib access"""

    def __init__(self, *args, **kwargs):
        kwargs = {'default': dict, 'encoder': DjangoJSONEncoder, **kwargs}
        return super().__init__(*args, **kwargs)

    def get_default(self):
        return AttrDict(super().get_default())

    def from_db_value(self, value, expression, connection):
        return AttrDict(value)
