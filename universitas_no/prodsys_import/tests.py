from django.test import TestCase
from .prodsys import Prodsys
from stories.models import Story

# Create your tests here.

def test_import_saker_fra_prodsys():
    # TODO: Make prodsys/tests.py instead!
    prodsys = Prodsys()
    with open('published.csv') as f:
        # set av faktiske saker i prodsys
        published = set(int(i.strip()) for i in f)
    max_id = 18658
    min_id = 18558
    imported_stories = set(
        # set of prodsys_ids of stories already imported
        Story.objects.values_list('prodsys_id', flat=True)
        )
    for prod_id in range(max_id, min_id, -1):
        if prod_id not in published:
            continue
        if not prod_id in imported_stories:
            if prodsys.createArticleText(prod_id):
                status = 'created'
            else:
                status = 'not in prodsys'
        else:
            status = 'already created'
        print('%i: %s' % (prod_id, status))