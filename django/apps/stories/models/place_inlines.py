import re

from diff_match_patch import diff_match_patch
from django.utils.translation import ugettext_lazy as _

from .storychildren import Aside, InlineHtml, Pullquote, StoryImage, StoryVideo


class InlineElementsMixin:
    """ Mixin for Story containing methods for automatic placement of inline
    elements"""

    def reindex_inlines(self, element_classes=None, body=None):
        """
        Change placeholders in bodytext markup.
        Updates indexes in related elements to match.
        Remove orphan placeholders.
        """
        INDEX_NOT_FOUND = _('No such element. Valid indexes: ')
        body = body or self.bodytext_markup

        element_classes = element_classes or [
            Aside,
            StoryImage,
            StoryVideo,
            Pullquote,
            InlineHtml,
        ]

        for element_class in element_classes:

            elements = {}
            top_index = 0
            body_changed = False
            elements_changed = False

            placeholders = self.find_inline_placeholders(element_class, body)
            queryset = element_class.filter(parent_story=self, top=False)
            indexes = list(queryset.values_list('index', flat=True))
            for placeholder in placeholders:
                replace = []
                seen_indexes = set()
                for index in placeholder['indexes']:
                    if index in seen_indexes:
                        continue
                    seen_indexes.add(index)
                    for el in queryset.filter(index=index):
                        if el.pk in elements:
                            this_index = elements[el.pk].index
                        else:
                            elements[el.pk] = el
                            top_index += 1
                            this_index = top_index
                            if (el.index, el.top) != (this_index, False):
                                elements_changed = True
                                el.index = this_index
                                el.top = False
                        if this_index not in replace:
                            replace.append(this_index)
                        else:
                            pass
                if replace:
                    replace = placeholder['flags'] + replace
                else:
                    replace = placeholder['elements'] + \
                        ['#', INDEX_NOT_FOUND] + indexes or ['None']
                placeholder['replace'] = element_class.markup_tag() + \
                    ' '.join(str(r) for r in replace)

                if placeholder['line'] != placeholder['replace']:
                    body_changed = True

                # logger.warn('\nflags: {flags}\nindexes: {indexes}\n {line} ->
                # {replace}'.format(**placeholder)))

            if elements_changed:
                for element in elements.values():
                    element.save()

            if body_changed:
                for placeholder in placeholders:
                    regex = '^{line}$'.format(line=placeholder['line'])
                    old_line = re.compile(regex, flags=re.M)
                    new_line = '#@##@#' + placeholder['replace']
                    body = old_line.sub(new_line, body, count=1)  # change
                body = re.sub('#@##@#', '', body)

        self.bodytext_markup = body
        return body

    def find_inline_placeholders(self, element_class, body):
        """ Find placeholder markup for images,
        pullquotes and other story elements. """
        regex = r'^{tag}\s*([^#\n]*).*$'.format(tag=element_class.markup_tag())
        FLAGS = ['<', '>']
        matches = re.finditer(regex, body, flags=re.M)
        placeholders = []
        for match in matches:
            elements = re.split(r'[\s,]+', match.group(1))
            placeholders.append({
                'elements': elements,  # for bugtesting
                'line': match.group(0),  # full match
                'flags': [item for item in elements if item in FLAGS],
                'indexes': [
                    int(index) for index in elements if index.isdigit()
                ],
            })
        return placeholders

    def place_all_inline_elements(self):
        """ Insert inline elements into the
        bodytext according to heuristics. """

        def _main(self=self, body=self.bodytext_markup):

            # remove tags:
            for cls in Aside, StoryImage, Pullquote, StoryVideo, InlineHtml:
                find = r'^{tag}.*$'.format(tag=cls.markup_tag())
                body = re.sub(find, '', body, flags=re.M)

            # insert asides
            asides = self.asides.inline()
            body = top_right(asides, body)

            # insert images
            images = self.images.inline()
            body = big_on_top_search_for_rest(images, body)

            # insert videos
            videos = self.videos.inline()
            body = fifty_fifty(videos, body)

            # insert pullquotes
            pullquotes = self.pullquotes.inline()
            body = fuzzy_search(pullquotes, body)

            return body

        def fifty_fifty(queryset, body):
            """Half of elements in header, rest spread evenly through body"""
            # TODO: Bedre autoplassering av foto.
            addlines = []
            for item in queryset:
                flags = ''
                line = '{tag} {flags} {index}'.format(
                    tag=item.child.markup_tag,
                    flags=flags,
                    index=item.index,
                )
                addlines.append(line)

            body = '\n'.join(addlines + [body.strip()])
            return body

        def big_on_top_search_for_rest(queryset, body):
            for item in queryset:
                if item.size < 2:
                    item.top = True
                    item.save()

            return fuzzy_search(queryset.inline(), body, flags='>')

        def top_right(queryset, body, flags='>'):
            """ All elements at top, pulled right """
            addlines = []

            for item in queryset:
                line = '{tag} {flags} {index}'.format(
                    tag=item.markup_tag,
                    flags=flags,
                    index=item.index,
                )
                addlines.append(line)

            body = '\n'.join(addlines + [body.strip()])
            return body

        def fuzzy_search(queryset, body, flags=''):
            """ Place elements according to fuzzy text search. """
            diff = diff_match_patch(
            )  # Google's diff-match-patch library for fuzzy matching
            # default is 1000 characters match distance
            diff.Match_Distance = 5000
            # default is 0.5 ; 1.0 matches everything, 0.0 matches only perfect
            # hits.
            diff.Match_Threshold = 0.25

            def _find_in_text(needle, haystack):
                # strip whitespace and non-word characters. Converts to
                # lowercase.
                needle = re.sub(r'\W', '', needle).lower()
                haystack = re.sub(r'\W', '', haystack).lower()
                value = diff.match_main(haystack, needle, 0)  # -1 is no match
                return value is not -1

            paragraphs = body.splitlines()

            for item in queryset:
                needle = item.needle()
                if not needle:
                    continue

                if item.index is None:
                    item.index = 0
                    item.save()  # reset index

                line = '{tag} {flags} {index}'.format(
                    tag=item.markup_tag, flags=flags, index=item.index
                )
                new_paragraphs = []
                for paragraph in paragraphs:
                    if needle and _find_in_text(needle, paragraph):
                        # found an acceptable match
                        new_paragraphs.append(line)
                        needle = None
                    new_paragraphs.append(paragraph)
                paragraphs = new_paragraphs

                if needle:
                    # place on top if no match is found.
                    paragraphs = [line] + paragraphs

            body = '\n'.join(paragraphs)
            # logger.debug(body)
            return body

        return _main()
