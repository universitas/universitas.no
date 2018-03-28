from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder


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


class AttrJSONField(JSONField):
    """JSON field with getattrib access"""

    def __init__(self, *args, **kwargs):
        kwargs = {'default': dict, 'encoder': DjangoJSONEncoder, **kwargs}
        return super().__init__(*args, **kwargs)

    def get_default(self):
        return AttrDict(super().get_default())

    def from_db_value(self, value, expression, connection):
        return AttrDict(value)
