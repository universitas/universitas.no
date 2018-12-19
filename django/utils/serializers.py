import json
import re

from rest_framework import exceptions, serializers

from apps.photo.cropping.boundingbox import CropBox


def validate_phone_number(num):
    if not re.match(r'\+?\d{8,20}', num):
        raise serializers.ValidationError('incorrect phone number')


class jsonDict(dict):
    def __str__(self):
        return json.dumps(self)


class PhoneNumberField(serializers.CharField):
    def __init__(self, **kwargs):
        kwargs = {'allow_blank': True, 'max_length': 20, **kwargs}
        super().__init__(**kwargs)

    def to_representation(self, obj):
        return obj.replace(' ', '')

    def to_internal_value(self, data):
        data = re.sub(r'[-–—\s]', '', data)
        data = re.sub(r'^00', '+', data)
        if data != '':
            validate_phone_number(data)
        return data


class AbsoluteURLField(serializers.Field):
    def __init__(self, *args, **kwargs):
        kwargs = {'read_only': True, **kwargs}
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        if not value:
            return None
        if hasattr(value, 'url'):
            value = value.url
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
