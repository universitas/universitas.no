from django.test import TestCase
from django.core.urlresolvers import resolve
from .views import *

class FrontpageViewTest(TestCase):

    def test_frontpage_renders(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed('frontpage.html')