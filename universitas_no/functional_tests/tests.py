""" Functional tests universitas.no """
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from django.contrib.staticfiles.testing import StaticLiveServerCase

# do not edit! added by PythonBreakpoints
from ipdb import set_trace as _breakpoint


ARTICLE_URL_REGEX=r'\S+/[a-z]+/\d+/[a-z\-]+/$',
WEBDRIVER = 'PhantomJS'
# WEBDRIVER = 'Firefox'

class FrontPageVisitTest(StaticLiveServerCase):

    def setUp(self):
        # TODO: load fixtures.
        if WEBDRIVER == 'PhantomJS':
            self.browser = webdriver.PhantomJS(
                executable_path='/home/haakenlid/node_modules/phantomjs/lib/phantom/bin/phantomjs')
        else:
            self.browser = webdriver.Firefox()

    def tearDown(self):
        self.browser.quit()

    def test_webserver_is_running(self):
        # Besøker nettsiden og sjekker at den funker.
        self.browser.get(self.live_server_url)

        self.assertIn('universitas.no', self.browser.title)

    def test_visitor_frontpage(self):
        # Ole-Petter har hørt at Universitas har fått en ny nettside.
        # Han skriver inn “http://universitas.no” i nettleseren for å se.
        self.browser.get(self.live_server_url)

        # På siden kan han se at avisa heter “Universitas” og er Norges største studentavis.
        self.assertIn('universitas', self.browser.title)
        self.assertIn('Norges største studentavis', self.browser.page_source)
        self.assertInHTML('Norges største studentavis', self.browser.page_source)

        # Det finnes en rekke saker på forsiden
        articles = self.browser.find_elements_by_css_selector('article')
        for article in articles:
            # , som alle har en tittel
            headline = article.find_elements_by_css_selector('.headline')
            self.assertIsNotNone(headline)
            # , og en lenke til selve saken.
            link = article.find_elements_by_css_selector('a')
            self.assertRegex(
                text=link.get_attribute('href'),
                expected_regex=ARTICLE_URL_REGEX,
                )

        # I tillegg til tittelen har hver forsidesak sin egen plassering på
        # forsiden i en layoutgrid, og kan ha stikktittel, bilde og ingress.


    def test_visitor_articlepage(self):
        # Ole-Petter besøker universitas.no og trykker på en av sakene på forsiden.
        self.browser.get(self.live_server_url)

        self.browser.find_element_by_css_selector('article h1 a').click()

        # Han blir sendt videre til artikkelvisningen for den saken.
        artikkel_url = self.browser.current_url

        # Han ser at url-en i nettleseren inneholder et id-nummer, en seksjon og tittelen på saken.
        self.assertRegex(
            # text=artikkel_url,
            text='http://universitas.no/seksjon/000000/tittel-pa-saken-/',
            expected_regex=ARTICLE_URL_REGEX,
        )

        # Han kan se et hovedbilde og en tittel.
        title = self.find_element_by_css_selector('article h1#headline')
        main_image = self.find_element_by_css_selector('article img#headline-photo')
        # Under det er det byline på journalist og fotograf, samt publiseringsdato
        # og hvilken seksjon artikkelen tilhører.
        byline = self.find_element_by_css_selector('article header .byline')


        # Det er knapper for å dele saken på facebook og Twitter, eller gå til diskusjonsfeltet.

        # Selve teksten starter med en ingress og inneholder avsnitt med brødtekst og mellomtitler.

        # Noen steder er det uthevede sitater eller fotografier.

        # Under fotografiene er det en billedtekst og navn på fotografen.

        # Under uthevede sitater er det navn på personen eller verk som siteres.

        # Under saken finnes det lenker til tre eller flere saker som er “relatert” til saken Ole-Petter leser.

        # Det er også et debattfelt.

        print(title, main_image, byline, artikkel_url)  # ubrukte variabler
        self.assertFalse(True)