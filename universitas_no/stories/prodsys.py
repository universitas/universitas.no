# -*- coding: utf-8 -*-
"""
Kontakte prodsys.
"""
from django.conf import settings
import requests
from datetime import datetime
import re
from stories.models import Story, StoryType, ProdsysTag

import ipdb


def createParagraphList(xtagtext):
    """ Split xtags story into a list of dictionaries. """
    xtag_regexp = re.compile(r'^@([^ :]+): ?(.*)$')
    paragraphs = []
    current_tag = "txt"
    for index, paragraph in enumerate(xtagtext.splitlines()):
        match = xtag_regexp.match(paragraph)
        if match:
            current_tag = match.group(1)
            paragraph = match.group(2)
        paragraphs.append({
            'line': index,
            'tag': current_tag,
            'text': paragraph,
        })
    return paragraphs


def wrapInHTML(paragraphs):  # TODO: Should maybe be in models?
    res = []
    for p in paragraphs:
        res.append(
            ProdsysTag.wrap_text(p['tag'], p['text'])
        )
    return '\n'.join(res)


class Prodsys(object):
    # TODO: Is there any reason this is a class?

    """Leser fra prodsys over web-api."""

    base_url = settings.PRODSYS_URL
    auth = (settings.PRODSYS_USER, settings.PRODSYS_PASSWORD)
    # http://universitas.no/admin/api/indesign/18566/json/
    # PRODSYS_ID = 18658

    def articleList(self):
        """ Contacts prodsys and returns a list of ids of available articles. """
        url = self.base_url + 'json/'
        json = requests.get(url, self.auth).json()
        saker = [sak.prodsak_id for sak in json]
        return saker

    def importArticleJson(self, prodsak_id):
        """ Import an article from prodsys as json
        returns the original string represtentation of the article """

        url = '%s%d/json/' % (self.base_url, prodsak_id)
        reply = requests.get(url, auth=self.auth)
        return reply

    def createArticleText(self, prodsak_id):
        """ Save imported article in db. """
        reply = self.importArticleJson(prodsak_id)
        if reply.status_code != 200:
            return False
        json = reply.json()
        text = json['tekst']
        prodsys_id = json['prodsak_id']
        # TODO: change replacement to exitst in db.
        text = text.replace('\x95', '•')  # bullet character
        text = text.replace('--', '–')  # en-dash
        text = text.replace('\r\n\r\n', '\n')  # line-endings
        text = re.compile(r'^# ', re.MULTILINE).sub('@li:', text)  # hash symbol to li
        paragraphs = createParagraphList(text)

        def pop_tags(tags=None):
            """ Seperates certain xtags from the content. """
            res = []
            if tags:
                for p in paragraphs[:]:
                    if p['tag'] in tags:
                        paragraphs.remove(p)
                        res.append(p['text'])

            return '\n'.join(res)
        # ipdb.set_trace()
        prodsys_id = json['prodsak_id']
        title = pop_tags('tit')
        lede = pop_tags('ing')
        prodsys_json = reply.text
        bylines = pop_tags('bl')  # TODO: create objects
        story_type = json['mappe']  # TODO: model method

        # images = json['bilete'] Ikkje alle sakar har bilete

        dateline_date = datetime.strptime(
            json['dato'], '%Y-%m-%d %H:%M:%S')
        dateline_place = ''
        publication_date = dateline_date
        # status (default)
        # TODO: Bør status alltid være det samme?
        theme_word = pop_tags('temaord')
        bodytext_markup = ''.join(['@%s:%s\n' % (p['tag'], p['text']) for p in paragraphs])
        # bodytext_markup = "\n".join(paragraphs)
        bodytext_html = wrapInHTML(paragraphs)
        sitater = pop_tags(tags=['sitat', 'sitatbyline']),
        fakta = pop_tags(['fakta', 'li']),
        mappe = json['mappe']
        story_type = StoryType.objects.filter(prodsys_mappe=mappe)
        if not story_type:
            story_type = StoryType.objects.last()
        else:
            story_type = story_type[0]

        new_story = Story(
            title=title,
            lede=lede,
            prodsys_id=prodsys_id,
            prodsys_json=prodsys_json,
            bodytext_markup=bodytext_markup,
            bodytext_html=bodytext_html,
            # bylines=?
            story_type=story_type,
            dateline_date=dateline_date,
            dateline_place=dateline_place,
            # publication_date=?,
            status=Story.STATUS_UNPUBLISHED,
            theme_word=theme_word,
            # issue=?,
            # page=?,
            # pdf_url=?,
        )
        # import ipdb; ipdb.set_trace()
        new_story.save()
        return True


def main():
    prodsys = Prodsys()
    with open('published.csv') as f:
        published = set(int(i.strip()) for i in f)
    max_id = 18658
    min_id = 18558
    imported_stories = set(
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


if __name__ == '__main__':
    main()
else:
    print(__name__)
