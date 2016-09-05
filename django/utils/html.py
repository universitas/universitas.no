from bs4 import BeautifulSoup as bs
from lxml import html, etree
import re


def minify(source):
    """Minify HTML"""
    stripped = re.sub(r'\s*\n\s*', '', source)
    stripped = re.sub(r'\s+', ' ', stripped)
    soup = bs(stripped)
    return ''.join(str(c) for c in soup.body.contents).strip()


def prettify(source):
    """Prettify HTML"""
    minified = minify(source)
    root = html.fromstring(minified)
    return etree.tostring(
        root, encoding='unicode', pretty_print=True
    ).strip()

data = """
    <div>
        <h1>
            Hello
        </h1>
    </div>
"""


def test_minify():
    assert minify('  <p/> ') == '<p></p>'
    assert minify('  \t<p>A<div>\nB</div> ') == '<p>A</p><div>B</div>'
    minified = minify(data)
    assert minified == '<div><h1>Hello</h1></div>'


def test_prettify():
    pretty = prettify(data)
    assert pretty == '<div>\n  <h1>Hello</h1>\n</div>'
