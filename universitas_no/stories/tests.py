# -*- coding: utf-8 -*-
"""
Tests.
"""
from django.test import TestCase
from .models import Aside, Pullquote, Byline, import_from_prodsys
from prodsys_import.id_liste import SAKER

class StoryTest(TestCase):
    fixtures = ['stories_testfixtures.json',]

    def test_create_story(self):
        """ Creates story instance in database """
        prodsak_id = 18797
        story = import_from_prodsys(prodsak_id)
        self.assertEqual(prodsak_id, int(story.prodsys_id))
        self.assertTrue(Byline.objects.all())
        self.assertTrue(Pullquote.objects.all())
        self.assertTrue(Aside.objects.all())
        # self.assertTrue(Image.objects.all())

    def test_create_stories(self, antall=10, slutt=1):
        til = -1 * slutt
        fra = -1 * ( 1 + antall - slutt )
        testsaker = SAKER[fra:til]
        import_from_prodsys(testsaker)
