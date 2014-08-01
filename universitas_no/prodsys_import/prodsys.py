# -*- coding: utf-8 -*-
"""
Kontakte prodsys.
"""
from django.conf import settings
import requests
from django.utils import timezone
import re


class Prodsys(object):
    # TODO: Should only contain CRUD operations.

    """Leser fra prodsys over web-api."""

    BASE_URL = settings.PRODSYS_URL
    AUTH = (settings.PRODSYS_USER, settings.PRODSYS_PASSWORD)
    DATEFORMAT = '%Y-%m-%d %H:%M:%S'
    PUBLISHED_MINIMUM_STATUS_CODE = 8

    def get_article_list(self):
        """ Contacts prodsys and returns a list of ids of available articles. """
        url = self.BASE_URL + 'json/'
        reply = requests.get(url, auth=self.AUTH)
        if reply.status_code != 200:
            # TODO: Raise error when prodsys import fails.
            return None
        json = reply.json()
        saker = [int(sak['prodsak_id']) for sak in json]
        return saker

    def get_article_json(self, prodsak_id):
        """ Import an article from prodsys as json
        returns the original string represtentation of the article """

        url = '%s%d/json/' % (self.BASE_URL, prodsak_id)
        reply = requests.get(url, auth=self.AUTH)
        return reply

    def clean_up_text(self, text):
        """ Fixes some characters and stuff in old prodsys implementation.
            string -> string
        """
        text = text.replace('@tit:', '@headline:', 1)  # main headline
        text = re.compile(r'^# ', re.MULTILINE).sub('@li:', text)  # hash symbol to li
        text = text.replace('--', '–')  # also dash
        text = text.replace('\x92', '\'')  # some fixes for win 1252
        text = text.replace('\x95', '•')  # bullet
        text = text.replace('\x96', '–')  # n-dash
        text = re.sub('[\r\n]+', '\n', text)
        # text = re.sub('[«»]', '"', text)
        text = re.sub(r'(\S)["“”]', r'\1»', text)
        text = re.sub(r'["“”]', r'«', text)
        return text

    def fetch_article_from_prodsys(self, prodsak_id):
        """ Save imported article in db. """
        reply = self.get_article_json(prodsak_id)
        if reply.status_code != 200:
            # TODO: Raise error when prodsys import fails.
            print(reply.status_code)
            return None
        json = reply.json()
        text = self.clean_up_text(json['tekst'])
        naive_date = timezone.datetime.strptime(json['dato'], self.DATEFORMAT)
        date = timezone.make_aware(naive_date, timezone.get_default_timezone())
        published = int(json['produsert']) >= self.PUBLISHED_MINIMUM_STATUS_CODE
        images = json.get('bilete', [])

        cleaned_output = {
            'prodsys_json': reply.text,
            'date': date,
            'bodytext_markup': text,
            'published': published,
            'images': images,
            'prodsys_id': json.get('prodsak_id'),
            'title': json.get('arbeidstittel'),
            'mappe': json.get('mappe'),
            # 'initials': json.get('journalist')
        }
        return cleaned_output
