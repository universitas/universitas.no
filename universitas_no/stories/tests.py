# -*- coding: utf-8 -*-
"""
Tests.
"""
from django.test import TestCase
from .prodsys import Prodsys
from .models import Story

# Create your tests here.


class ImportTest(TestCase):

    """ Tests imports from prodsys """

    def test_import_article(self):
        """ Imports an article from the prodsys """
        prodsys = Prodsys()
        prod_id = 18658
        reply = prodsys.importArticleJson(prod_id)
        self.assertEqual('http://universitas.no/admin/api/indesign/%d/json/' % prod_id, reply.url)
        self.assertEqual(200, reply.status_code)
        self.assertIn('prodsak_id', reply.text)

    def test_create_story(self):
        """ Creates story instance in database """

        prodsys = Prodsys()
        prod_id = 18658

