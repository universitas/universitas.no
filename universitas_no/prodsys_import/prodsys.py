# -*- coding: utf-8 -*-
"""
Kontakte prodsys.
"""
from django.conf import settings
import requests
from datetime import datetime
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
        json = requests.get(url, self.AUTH).json()
        saker = [sak.prodsak_id for sak in json]
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
        text = text.replace('@tit:', '@headline:', count=1)  # main headline
        text = text.replace('\x95', '•')  # bullet character
        text = text.replace('--', '–')  # en-dash
        text = text.replace('\r\n\r\n', '\n')  # line-endings
        text = re.compile(r'^# ', re.MULTILINE).sub('@li:', text)  # hash symbol to li
        return text

    def fetch_article_from_prodsys(self, prodsak_id):
        """ Save imported article in db. """
        reply = self.importArticleJson(prodsak_id)
        if reply.status_code != 200:
            # TODO: Raise error when prodsys import fails.
            print(reply.status_code)
            return None
        json = reply.json()
        text = self.cleanUpText(json['tekst'])
        date = datetime.strptime(json['dato'], self.DATEFORMAT)
        published = int(json['produsert']) >= self.PUBLISHED_MINIMUM_STATUS_CODE

        cleaned_output = {
            'prodsys_json': reply.text,
            'date': date,
            'text': text,
            'published': published,
            'prodsys_id': json['prodsys_id'],
            'title': json['arbeidstittel'],
            'mappe': json['mappe'],
            'images': json['bilete'],
        }
        return cleaned_output
