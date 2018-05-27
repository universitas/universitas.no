import json

from apps.photo.cropping.boundingbox import CropBox
from rest_framework import exceptions, serializers


class jsonDict(dict):
    def __str__(self):
        return json.dumps(self)


class AbsoluteURLField(serializers.Field):
    def __init__(self, *args, **kwargs):
        kwargs['read_only'] = kwargs.get('read_only', True)
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        if not value:
            return None
        request = self.context.get('request', None)
        if request is not None:
            return request.build_absolute_uri(value)
        return value


class CropBoxField(serializers.Field):
    def to_representation(self, obj):
        return jsonDict(obj.serialize())

    def to_internal_value(self, data):
        try:
            if isinstance(data, str):
                data = json.loads(data)
            return CropBox(**data)
        except (Exception) as err:
            raise exceptions.ValidationError(str(err)) from err
