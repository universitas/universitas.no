# -*- coding: utf-8 -*-
"""
Tests of stories app.
"""
import re
# from .test import TestCase
# from unittest import TestCase
# from .model.s import BlockTag, InlineTag
from django.test import SimpleTestCase
from myapps.stories.models import Section, Story, StoryType


class PositionsTest(SimpleTestCase):

    def test_positions_regex(self):
        """ Positions regular expression picks up stuff """
        elements = [
            ('image', 1, 'large',),
            ('aside', 3, 'left',),
            ('video', 4, 'right',),
            ('blockquote', 1, 'center',),
        ]

        markup = '@txt: Lorem ipsum'
        for element in elements:
            markup += '\n@{0}.{1}.{2}@ {0} number {1}'.format(*element)
            markup += '\n@{0}@'.format(*element)

        story = Story()
        story.bodytext_markup = markup
        story.title = 'new story'
        labels = story.positions.placeholders()

        self.assertEqual(len(elements) * 2, len(labels), 'tree labels per element')
        for n, label in enumerate(labels):
            element = elements[n // 2]
            self.assertEqual(label.type, element[0], 'label type is correct')
            if n % 2:  # minimal markup
                self.assertEqual(label.index, None, 'no index')
                self.assertEqual(len(label.styles), 0, 'no styles')
                self.assertEqual(len(label.comment), 0, 'no comment')
            else:  # full markup
                self.assertEqual(label.index, element[1], 'index is integer')
                self.assertEqual(label.styles[0], element[2], 'correct style')
                self.assertEqual(len(label.styles), 1, 'has one style')
                self.assertGreater(len(label.comment), 5, 'has comment')

        story.positions.reindex()
        labels = story.positions.placeholders()

        for n, label in enumerate(labels):
            element = elements[n // 2]
            self.assertEqual(label.type, element[0], 'label type is correct')
            self.assertEqual(label.index, n+1, 'index is now reordered')