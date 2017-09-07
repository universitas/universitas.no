#!/usr/bin/env python3

import requests
import re
from collections import OrderedDict
import json
url = 'https://raw.githubusercontent.com/ramda/ramda/master/dist/ramda.js'


def parse_jsdoc(doc='', name=''):
    doc = doc.replace('\u2192', '->')
    doc = re.sub(r'^\s*\*[ \/]?', '', doc, flags=re.M)
    sig = re.search(r'@sig (.+)', doc)
    if sig:
        sig = sig.groups()[0]
    else:
        sig = ''
    private = bool(re.search(r'@private', doc))
    doc = doc.split('\n\n')[0].replace('\n', ' ')
    return (name, doc, sig, private)


def sig_to_terntype(sig):

    sig = re.sub(r'^.*=>', '', sig)
    # sig = re.sub(r'\* ->', 'fn() ->', sig)
    sig = re.sub(r'\([^(]*?\)', ' fn ', sig)
    sig = re.sub(r'\([^(]*?\)', ' fn ', sig)
    length = len(sig.split('->'))
    if length == 1: 
        return ''
    return ' -> '.join(['fn()'] * (length - 1) + ['!0'])


code = requests.get(url).text
pattern = re.compile(
    r'/\*\*(?P<doc>.*?)^\s*var (?P<name>\w+) =',
    flags=re.DOTALL | re.MULTILINE
)


R = OrderedDict()  # type: dict
matches = [m.groupdict() for m in pattern.finditer(code)]


def sortByName(d):
    return d['name']

print(len(matches))

for match in sorted(matches, key=sortByName)[:]:
    name, doc, sig, private = parse_jsdoc(**match)
    if not private:
        R[name] = {
            '!sig': sig,
            '!type': sig_to_terntype(sig),
            '!doc': doc,
            # '!url': 'http://ramdajs.com/docs/#' + name,
        }


with open('ramda.json', 'w') as fp:
    json.dump({"!name": "ramda", "R": R}, fp, indent=2)
