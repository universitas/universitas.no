from rest_framework.serializers import Field


class AbsoluteURLField(Field):
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
