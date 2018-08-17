import re
from urllib import parse

from requests_html import HTMLSession

from utils.decorators import cache_memoize

FIVE_MINUTES = 5 * 60


@cache_memoize(FIVE_MINUTES)
def fetch_ads(url='http://tankeogteknikk.no/qmedia/oslo.php'):
    """Crawl tankeogteknikk web site and fetch current ads"""
    r = HTMLSession().get(url)
    r.raise_for_status()  # raise exception if 404 or other non ok http status
    subs = r.html.find('table.sub')
    ads = [_parse_sub_advert(sub) for sub in subs]
    for ad in ads:
        # use absolute and quoted urls
        ad['image'] = parse.quote(parse.urljoin(url, ad['image']), safe='/:')
    return ads


def _parse_sub_advert(sub):
    link = parse.urlparse(sub.find('a', first=True).attrs['href'])
    return {
        'id': int(re.search(r'\d+', link.query)[0]),
        'text': sub.find('td')[1].text,
        'link': parse.urlunparse(link),
        'image': sub.find('img', first=True).attrs['src'],
    }
