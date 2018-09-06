import json

from rest_framework import exceptions, serializers

from apps.photo.cropping.boundingbox import CropBox


class jsonDict(dict):
    def __str__(self):
        return json.dumps(self)


class AbsoluteURLField(serializers.Field):
    def __init__(self, *args, **kwargs):
        kwargs = {'read_only': True, **kwargs}
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        if not value:
            return None
        request = self.context.get('request', None)
        if request is not None:
            return str(request.build_absolute_uri(value))
        return str(value)


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
