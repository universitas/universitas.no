from django.test import TestCase
from .prodsys import Prodsys
from stories.models import Story
from os import path
pub_prod = path.join(path.dirname(__file__), 'published-prodsaker.csv')
# Create your tests here.


class ImportTest(TestCase):

    ''' Tests imports from prodsys '''
    prodsys = Prodsys()
    with open(pub_prod) as f:
        # set av faktiske saker i prodsys
        s = f.read().split(',')
        published = [int(i.strip()) for i in s]
        published.reverse()

    def test_import_article(self):
        ''' Imports an article from the prodsys '''
        return
        prod_id = self.published[0]
        reply = self.prodsys.get_article_json(prod_id)
        self.assertEqual('http://universitas.no/admin/api/indesign/%d/json/' % prod_id, reply.url)
        self.assertEqual(200, reply.status_code)
        self.assertIn('prodsak_id', reply.text, )

    def test_get_article_list(self):
        return
        saker = self.prodsys.get_article_list()
        self.assertIs(type(saker), list, msg='expects a list of prodsak_id that are in production.')
        for prodsak_id in saker:
            self.assertIs(type(prodsak_id), int, msg='expects a list of prodsak_id that are in production.')

    def test_import_saker_fra_prodsys(self, save=False):
        importlist = self.published[:10]
        importlist = [18797]
        for prodsak_id in importlist:
            cleaned_output = self.prodsys.fetch_article_from_prodsys(prodsak_id)
            for key, value in cleaned_output.items():
                print('%s:   %s\n' % (key, value))
            print('–'*40)

    def import_n_saker(self, n):
        from stories.models import import_from_prodsys
        import_from_prodsys(self.published[:n])
