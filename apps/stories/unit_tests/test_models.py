# -*- coding: utf-8 -*-
"""
Tests of stories app.
"""
import re
# from .test import TestCase
# from unittest import TestCase
# from .model.s import BlockTag, InlineTag
from django.test import SimpleTestCase
from apps.stories.models import Section, Story, StoryType, StoryImage, Pullquote
from pprint import pprint


class InLineElementsTest(SimpleTestCase):

    # def set_up(self):
    #     exists, section = Section.objects.get_or_create(title='section')
    #     StoryType.objects.get_or_create(title='section', section=section)

    def test_find_inlines(self):
        text = re.sub(
            r'\s*\n\s*',
            '\n',
            """
            @tit: lol
            @txt: no chance
            @image: < 1 3 50
            sdlkfjslkfjalkjdf
            slkdfj sldkfj aa allslsdkf
            @mt: oh no!
            @box: 3
            @quote: > 1
            @image: 44 444 4
            """,
        ).strip()

        story = Story(bodytext_markup=text)

        image_placeholders = story.find_inline_placeholders(element_class=StoryImage)
        self.assertEqual(len(image_placeholders), 2)
        self.assertEqual(image_placeholders[1]['indexes'], [44, 444, 4])
        self.assertEqual(image_placeholders[0]['flags'][0], '<')

        pullquote_placeholders = story.find_inline_placeholders(element_class=Pullquote)
        self.assertEqual(len(pullquote_placeholders), 1)
        self.assertEqual(pullquote_placeholders[0]['indexes'], [1])
        self.assertEqual(pullquote_placeholders[0]['flags'], ['>'])

from itertools import permutations
import math

def sieve_of_eratosthenes(ceiling):
    primes = []
    for num in range(2, math.ceil(ceiling)):
        root = math.ceil(num ** .5)
        for pr in primes:
            if num % pr == 0:
                break
            if root < pr:
                primes.append(num)
                break
        else:
            primes.append(num)
    return primes

def main():
    seed = 123456789
    storetall = (int(''.join(p)) for p in permutations(str(seed)))
    smallest = int(seed ** .5)
    primes = sieve_of_eratosthenes(smallest)
    for nn, tall in enumerate(storetall):
        tt = tall
        factors = []
        for prime in primes:
            if prime > smallest or prime >= tt:
                break
            while tt % prime == 0:
                tt = tt // prime
                factors.append(prime)
        if tt != 1:
            factors.append(tt)
        if factors[-1] <= smallest:
            smallest = factors[-1]
            print('{sum} = {factors}'.format(sum=tall, factors=' × '.join(str(f) for f in factors[::-1])))
    print(smallest)

main()
