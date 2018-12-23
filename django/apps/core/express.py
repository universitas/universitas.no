import json
import logging

from django.conf import settings
import requests

logger = logging.getLogger(__name__)


def express(path, payload):
    """Interface to express server"""
    adapter = requests.adapters.HTTPAdapter(max_retries=8)
    session = requests.Session()
    session.mount(settings.EXPRESS_SERVER_URL, adapter)
    try:
        response = session.post(
            url=f'{settings.EXPRESS_SERVER_URL}/{path}',
            json=payload,
            timeout=5,
        )
    except (requests.ConnectionError, requests.Timeout) as e:
        logger.exception('Could not connect to express server')
        return {'state': {}, 'error': f'{e}'}
    try:
        return response.json()
    except json.JSONDecodeError as e:
        logger.exception('Invalid JSON from express')
        return {'state': {}, 'error': f'{e}\n{response.content}'}


def build_node_tree(story):
    data = serialize_public_story(story)
    return express('nodetree', data)


def clean_markup(markup):
    markup = markup.replace('@sit:', '@sitat:')
    response = express('markup', {'payload': markup})
    return response.get('payload')


def react_server_side_render(actions, url, path):
    """Express server side rendering of react app"""
    return express(f'render{path}', {'actions': actions, 'url': url})


def serialize_public_story(story):
    from api.publicstories import PublicStorySerializer
    from django.http import HttpRequest
    req = HttpRequest()
    req.META['SERVER_NAME'] = 'localhost'
    req.META['SERVER_PORT'] = 80
    res = PublicStorySerializer(story, context={'request': req})
    return res.data
