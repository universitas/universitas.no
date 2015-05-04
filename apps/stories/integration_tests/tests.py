# -*- coding: utf-8 -*-
"""
Integration tests of stories app.
"""
import re
from django.test import TestCase
from apps.markup.models import BlockTag, InlineTag
from apps.stories.models import Section, Story, StoryType


class StoryModelTest(TestCase):
    fixtures = ['test_fixtures_markup.json', ]

    def test_fixtures_loaded(self):
        """ Test that markup tags are loaded. These are needed for integration tests. """
        self.assertGreaterEqual(BlockTag.objects.count(), 5, 'at least five block tags')
        self.assertGreaterEqual(InlineTag.objects.count(), 3, 'at least three inline tags')

    def generic_story(
            self,
            header=None,
            body=None,
            postscriptum=None,
            story_type='new story type',
            section='new section'):
        new_section, new = Section.objects.get_or_create(title=section)
        new_story_type, new = StoryType.objects.get_or_create(name=story_type, section=new_section)

        header = header or '''
        @tit: A New Story
        '''
        body = body or '''
        @mt: Pitchfork Schlitz fixie hoodie
        Gastropub YOLO small batch kitsch. Fingerstache direct trade messenger bag, freegan 3 wolf moon squid Truffaut.
        Distillery vinyl, Bushwick vegan deep v street art roof party normcore. Direct trade craft beer banh mi selvage.
        Neutra lo-fi drinking vinegar, cold-pressed selvage Kickstarter Schlitz literally distillery food.
        @mt: Truck vegan meditation farm-to-table authentic.
        @txt:Crucifix beard cred, hoodie ennui sustainable blog before they sold out small batch squid biodiesel.
        Tote bag XOXO Wes Anderson 3 wolf moon. Marfa vegan health goth Neutra drinking vinegar.
        @mt:Fingerstache quinoa High Life
        Put a bird on it PBR&B four loko master cleanse Shoreditch single-origin coffee DIY sriracha.
        Lomo normcore food truck put a bird on it Bushwick Schlitz ugh Brooklyn McSweeney's fashion axe.
        Farm-to-table Tonx banjo, gluten-free leggings master cleanse kogi keytar normcore pour-over tofu sartorial.
        '''
        postscriptum = postscriptum or '''
        @bl:foto:Bob cameraguy; text:  Liza Writer Genious
        '''

        bodytext = '{}\n{}\n{}'.format(header, body, postscriptum)
        bodytext = re.sub(r'\s*\n\s*', '\n', bodytext)
        new_story = Story(bodytext_markup=bodytext, story_type=new_story_type)
        new_story.save()
        return new_story

    def test_generic_story_and_story_type_created(self):
        """ Basic saving and relations. """
        story_type = 'hipster news'

        self.assertEqual(Section.objects.count(), 0, 'no sections exist.')

        new_story = self.generic_story(story_type=story_type)

        self.assertEqual(Story.objects.count(), 1, 'one story created')
        self.assertEqual(StoryType.objects.count(), 1, 'one story type created')
        self.assertEqual(Section.objects.count(), 1, 'one section created')

        self.assertEqual(Story.objects.first(), new_story, 'The new story was saved correctly.')
        self.assertEqual(new_story.section, Section.objects.first(), 'Story has a section.')
        self.assertEqual(new_story.story_type.name, story_type, 'Story type has a great name!')

    def test_story_headers(self):
        """ Story save should put these things into correct places. """
        headline = "Fixie semiotics"
        lede = "Art party, synth taxidermy forage meggings meh migas McSweeney's."
        kicker = "Gluten-free viral retro irony:"
        theme_word = "Flexitarianism"
        text = "Fingerstache typewriter artisan yr kale chips Etsy."

        header = '''
            @tit:     {headline}
            @ing:     {lede}
            @stikktit:{kicker}
            @tema:    {theme_word}
            @txt:     {text}
        '''.format(**locals())

        new_story = self.generic_story(header=header)

        for content, field in [
            (headline, new_story.title),
            (kicker, new_story.kicker),
            (lede, new_story.lede),
            (theme_word, new_story.theme_word),
        ]:
            self.assertEqual(content, field, 'Content has been moved to modelfield.')
            self.assertNotIn(content, new_story.bodytext_markup, 'Content is no longer in the body text.')

        self.assertIn(text, new_story.bodytext_markup, 'This content is still in the body text.')

        another_story = self.generic_story()
        another_story.bodytext_markup += header  # append headers to existing story
        another_story.save()

        for content, field in [
            (headline, another_story.title),
            (kicker, another_story.kicker),
            (lede, another_story.lede),
            (theme_word, another_story.theme_word),
        ]:
            self.assertIn(content, field, 'Content has been added to modelfield.')
            self.assertNotIn(content, another_story.bodytext_markup, 'Content is no longer in the body text.')

        self.assertIn(text, new_story.bodytext_markup, 'This content is still in the body text.')

    def test_element_objects(self):
        body = ['lorem'] * 20 + [' Cogito ergo sum! '] + ['lorem'] * 20
        aside = [
            '@fakta: Faktatittel',
            '# bullet 1',
            '#bullet 2'
        ]
        quote = [
            '@sitat:"Cogito ergo sum!"',
            '@sitatbyline:Rene Descartes, philosopher'
        ]
        new_story = self.generic_story(body='\n'.join(body), postscriptum='\n'.join(aside + quote))

        self.assertEqual(new_story.pullquote_set.count(), 1)
        self.assertEqual(new_story.aside_set.count(), 1)

        pullquote = new_story.pullquote_set.all()[0]
        aside = new_story.aside_set.all()[0]

        self.assertIn('Cogito ergo sum!', new_story.bodytext_markup)
        self.assertNotIn('Rene Descartes', new_story.bodytext_markup)
        self.assertNotIn('Faktatittel', new_story.bodytext_markup)

        self.assertIn('<bq class="pullquote">', pullquote.bodytext_html)
        self.assertIn('Rene Descartes', pullquote.bodytext_markup)
        self.assertIn('Cogito ergo sum!', pullquote.bodytext_markup)

        self.assertIn('<h2 class="facts">', aside.bodytext_html)
        self.assertIn('Faktatittel', aside.bodytext_markup)
        self.assertIn('bullet 1', aside.bodytext_html)
