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
        # prod_id = 0
        prod_id = 18658
        reply = prodsys.importArticleJson(prod_id)
        self.assertEqual('http://universitas.no:80/admin/api/indesign/%d/json/' % prod_id, reply.url)
        self.assertEqual(200, reply.status_code)
        self.assertIn('prodsak_id', reply.text)

    def test_create_story(self):
        """ Creates story instance in database """

        prodsys = Prodsys()
        # prod_id = 0
        prod_id = 18658
        reply = prodsys.importArticleJson(prod_id)
        json = reply.json()
        story = Story()
        story.title = json.arbeidstittel
        story.prodsys_id = json.prodsak_id
        story.prodsys_json = reply.text

        text = json['tekst']
        text = text.replace('\x95', '•').replace('--', '–').replace('\r\n\r\n', '\n')
