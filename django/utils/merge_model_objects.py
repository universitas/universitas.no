from itertools import filterfalse, tee

from django.apps import apps
from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import transaction
from django.db.models.fields.related import ManyToManyRel, ManyToOneRel
from utils.disconnect_signals import disconnect_signals


def partition(pred, iterable):
    'Use a predicate to partition entries into false entries and true entries'
    # partition(is_odd, range(10)) --> 0 2 4 6 8   and  1 3 5 7 9
    t1, t2 = tee(iterable)
    return list(filter(pred, t1)), list(filterfalse(pred, t2))


def _get_generic_fields():
    """Return a list of all GenericForeignKeys in all models."""
    generic_fields = []
    for model in apps.get_models():
        for field_name, field in model.__dict__.items():
            if isinstance(field, GenericForeignKey):
                generic_fields.append(field)
    return generic_fields


def is_class(cls):
    'curried isinstance'
    return lambda item: isinstance(item, cls)


@transaction.atomic()
def merge_instances(primary_object, *alias_objects, disable_signals=True):
    """Merge several model instances into one, the `primary_object`.
    Use this function to merge model objects and migrate all of the related
    fields from the alias objects the primary object.
    Usage:
        from django.contrib.auth.models import User
        primary_user = User.objects.get(email='good@example.com')
        duplicate_user = User.objects.get(email='good+duplicate@example.com')
        merge(primary_user, duplicate_user)
    Based on: https://djangosnippets.org/snippets/382/
    Based on https://djangosnippets.org/snippets/2283/
    """
    if disable_signals:
        # Because backing image files can be identical, do not run delete
        # signals that could remove file for both instances.
        disconnect_signals()

    generic_fields = _get_generic_fields()

    # get reverse related fields
    reverse_relations = primary_object._meta._get_fields(
        forward=False, include_hidden=True
    )

    fk_relations, m2m_relations = partition(
        is_class(ManyToOneRel), reverse_relations
    )

    for alias_object in alias_objects:

        # Migrate all foreign key refs from alias object to primary object.
        for fk_rel in fk_relations:
            # The variable name on the related model.
            related_object_set = getattr(
                alias_object, fk_rel.get_accessor_name()
            )
            for obj in related_object_set.all():
                setattr(obj, fk_rel.field.name, primary_object)
                obj.save()

        # Migrate all many to many refs from alias object to primary object.
        for m2m_rel in m2m_relations:
            if m2m_rel.through:
                # If a relation is `through`, it was processed as fk_rel
                continue
            related_object_set = getattr(
                alias_object, m2m_rel.get_accessor_name()
            )
            for obj in related_object_set.all():
                related_set = getattr(obj, m2m_rel.field.name)
                related_set.remove(alias_object)
                related_set.add(primary_object)

        # Migrate all generic relations from alias object to primary object.
        for field in generic_fields:
            filter_kwargs = {
                field.fk_field: alias_object._get_pk_val(),
                field.ct_field: field.get_content_type(alias_object),
            }
            related_objects = field.model.objects.filter(**filter_kwargs)
            for generic_related_object in related_objects:
                setattr(generic_related_object, field.name, primary_object)
                generic_related_object.save()

        if alias_object.id:
            alias_object.delete()

    return primary_object
