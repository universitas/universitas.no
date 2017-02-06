#! /usr/bin/env python
# -*- coding: utf-8 -*-
""" Create postactivate shell script file """
import random
from requests import request
from os import environ, path
import sys

PREFIX = 'DJANGO_'  # Environment variable prefix
SETTINGS_MODULE = 'universitas'  # Python module path to settings folder
WEBSERVER_ROOT = '/srv'  # Location of each django project
OVERRIDES = {  # Change some settings from the defaults in named deployments.
    'www': {
        'settings_module': '{}.production'.format(SETTINGS_MODULE,),
        'raven_dsn': (
            'http://31adff29503e473bb00f41832958fb80:'
            'eef12d718965495abaf83131d95a921e'
            '@sentry.haken.no/1'
            ),
    },
    'staging': {
        'settings_module': '{}.production'.format(SETTINGS_MODULE,),
    },
}


def make_postactivate_file(site_url, file_path=None):
    """ Make a postactivate file and return settings as a dictionary. """

    if file_path is None:
        file_path = '{this_folder}/postactivate.{url}'.format(
            this_folder=path.dirname(path.abspath(__file__)),
            url=site_url,
        )
    contents, settings = make_postactivate_text(site_url)
    with open(file_path, 'w') as f:
        f.write(contents)

    return file_path, settings


def _make_random_sequence(length=50):
    """ Generate a random string for secret key or password """
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return ''.join(random.SystemRandom().choice(chars) for n in range(length))


def _find_my_ip_address():
    """ find public ip of local computer """
    for url in ['http://ipecho.net/plain', 'http://canihazip.com/s']:
        try:
            return request('get', url, timeout=0.5).text
        except:
            pass
    else:
        return '127.0.0.1'


def make_postactivate_text(site_url):
    """
    Generate the text of a shell script to run on virtualenv activation.
    Returns the contents as a tuple containing a string and a dictionary.
    """
    prefix = site_url.split('.')[0]
    settings = {}
    for key in environ.keys():
        if key.startswith(PREFIX):
            new_key = key.replace(PREFIX, '', 1).lower()
            settings[new_key] = environ.get(key)

    settings.update({
        'source_folder': '{root}/{url}/django'.format(
            root=WEBSERVER_ROOT, url=site_url, ),
        'site_url': site_url,
        'allowed_hosts': '{}'.format(site_url,),
        'settings_module': '{module}.{prefix}'.format(
            module=SETTINGS_MODULE, prefix=prefix,
        ),
        'secret_key': _make_random_sequence(50),
        'db_password': _make_random_sequence(50),
        'db_user': site_url.replace('.', '_'),
        'db_name': site_url.replace('.', '_'),
        'user': site_url.replace('.', '_'),
        'debug_toolbar_internal_ips': _find_my_ip_address(),
    })

    if prefix in OVERRIDES:
        settings.update(OVERRIDES[prefix])

    postactivate = (
        '#!/bin/bash\n'
        '# This hook is run after the virtualenv is activated.\n\n'
        '# Environmental variables for django projects.\n\n'
    )
    for key in sorted(settings):
        postactivate += 'export {prefix}{key}="{value}"\n'.format(
            prefix=PREFIX,
            key=key.replace(' ', '_').upper(),
            value=settings[key],
        )
    postactivate += ('\n'
                     'export PYTHONPATH="$DJANGO_SOURCE_FOLDER"\n'
                     'export PATH="$(dirname $DJANGO_SOURCE_FOLDER)/node_modules/.bin:$PATH"\n'
                     'export PYTHONWARNINGS=ignore\n'
                     'cd $DJANGO_SOURCE_FOLDER\n')
    return postactivate, settings


if (__name__) == '__main__':
    # make a postactivate file for local dev server.
    try:
        site_url = sys.argv[1]
    except IndexError:
        try:
            site_url = environ['DJANGO_SITE_URL']
        except KeyError:
            exit('ABORTING: no site url given')

    import ipdb
    ipdb.set_trace()
    # site_url='local.{}'.format('site')
    make_postactivate_file(site_url)
