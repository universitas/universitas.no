# -*- coding: utf-8 -*-
""" Byline cleanup magic. """
import re
import logging
bylines_logger = logging.getLogger('bylines')


def clean_up_bylines(raw_bylines):
    """
    Normalise misformatting and idiosyncraticies of bylines in legacy data.
    string -> string
    """
    replacements = (
        # email addresses will die!
        (r'\S+@\S+', '', 0),

        # Symbols used to separate individual bylines.
        (r'[\r\n]+|\s*[;♦∙•Ï·]\s*| [-–*#] |/', r'\n', re.I),

        # remove underscores and asterisks.
        (r'[_*]', '', 0),

        # Credit with colon must be at the beginning of a line.
        (r' +((?:foto|video|photo|text|tekst|illus|graf)\w+):', r'\n\1', re.I),

        # "and" or "og" before two capitalised words probably means it's
        # a new person. Insert newline.
        (r'\s+([oO]g\s|[aA]nd\s)\s*([A-ZÆØÅ]\S+ [A-ZÆØÅ])', r'\nditto:\2', 0),

        # student, Universitet -> student ved Universitet
        (r'(student), ([A-Z])', r'\1 ved \2', 0),

        # uncapitalized word, comma and two capitalized words probably means a
        # new person.
        (r'( [a-zæøå)(]+), ([A-ZÆØÅ]\S+ [A-ZÆØÅd])', r'\1\n\2', 0),

        # TODO: Bytt ut byline regular expression med ny regex-modul som funker
        # med unicode

        # parantheses shall have no spaces inside them, but after and before.
        (r' *\( *(.*?) *\) *', r' (\1)\n', 0),

        # close parantheses.
        (r'(\([^)]+)$', r'\1)', re.M),

        # words in parantheses at end of line is probably some creditation.
        # Put in front with colon instead.
        # (r'^(.*?) *\(([^)]*)\) *$', r'\2: \1', re.M),
        (
            r'^(.*?) *\((\w*(?:fot|vid|pho|tex|tek|ill|gra)[^)]*)\) *$',
            r'\2: \1',
            re.M | re.I),

        # Oversatt = translation
        (r'^(oversatt av|translated by):? ', 'translation: ', re.I | re.M),

        # "Anmeldt av" is text credit.
        (r'^anmeldt av:?', '', re.I | re.M),

        # skrevet av = text
        (r'^(skrevet )?(av|by|ved):?', '', re.I | re.M),

        # ... og foto
        (r'og foto:?', 'and photo:', re.I),
        (r'og video:?', 'and video:', re.I),
        (r'og tekst:?', 'and text:', re.I),

        # Any word containging "photo" is some kind of photo credit.
        (r'^ *\w*(ph|f)oto\w*:?', '\nphoto:', re.I | re.M),

        # Any word containing "text" is text credit.
        (r'^ *\w*te(ks|x)t\w*:?', '\ntext:', re.I | re.M),

        # These words are stripped from end of line.
        (r' *(,| og| and) *$', '', re.M | re.I),

        # These words are stripped from start of line
        (r'^ *(,|og |and |av ) *', '', re.M | re.I),

        # These words are stripped from after colon
        (r': *(,|og |and |av ) *', ':', re.M | re.I),

        # Creditline with empty space after it is deleted.
        (r'^\S:\s*$', '', re.M),

        # Multiple spaces.
        (r' {2,}', ' ', 0),

        # Remove lines containing only whitespace.
        (r'\s*\n\s*', r'\n', 0),

        # Bylines with no credit are generic.
        (r'^([^:\n]{5,20})$', r'by:\1', re.M),
        (r'^([^:\n]{20})', r'by:\1', re.M),

        # Exactly one space after and no space before colon or comma.
        (r'\s*([:,])+\s*', r'\1 ', 0),

        # No multi colons
        (r': *:', r':', 0),

        # No random colons at the start or end of a line
        (r'^\s*:', r'', re.M),
        (r':\s*$', r'', re.M),

        # No full stops at end of a line.
        (r'\.$', r' ', 0),

        # Two credits become one
        (r'^(\w+): (\w+):', r'\1 and \2:', re.M),
        (r': ?and ', r' and ', 0),

        # Somewhere!
        (r': (i|på) (\S+): (.*)$', r': \3, \1 \2', re.M | re.I),

        # Ditto credit
        (r'(^(.+?:).+\n)ditto:', r'\1\2', re.M | re.I),
        (r' and ditto:', ':', re.I),
    )

    byline_words = []

    for word in raw_bylines.split():
        byline_words.append(word)

    bylines = ' '.join(byline_words)

    for pattern, replacement, flags in replacements[:]:
        bylines = re.sub(pattern, replacement, bylines, flags=flags)
    bylines = bylines.strip()
    if 'photo:' in bylines:
        bylines = bylines.replace('by:', 'text:')

    bylines_logger.info(
        '("%s",\n"%s"),' % (raw_bylines, bylines)
    )
    return bylines
