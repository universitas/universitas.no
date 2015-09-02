# -*- coding: utf-8 -*-
""" Create postactivate shell script file """
import random
from requests import request
from os import environ, path

PREFIX = 'DJANGO_'  # Environment variable prefix
SETTINGS_MODULE = 'settings'  # Python module path to settings folder
WEBSERVER_ROOT = '/srv'  # Location of each django project
OVERRIDES = {  # Change some settings from the defaults in named deployments.
    'www': {
        'settings module': '{}.production'.format(SETTINGS_MODULE,),
    },
    'staging': {
        'settings module': '{}.production'.format(SETTINGS_MODULE,),
    },
}

def make_postactivate_file(site_url, file_path=None):
    """ Make a postactivate file and return settings as a dictionary. """
    if file_path is None:
        file_path = '{this_folder}/postactivate.{url}'.format(
            this_folder=path.dirname(__file__),
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
    try:
        return request('get', 'http://ipecho.net/plain').text
    except:
        pass
    try:
        return request('get', 'http://canihazip.com/s').text
    except:
        return '127.0.0.1'


def make_postactivate_text(site_url):
    """
    Generate the text of a shell script to run on virtualenv activation.
    Returns the contents as a tuple containing a string and a dictionary.
    """
    settings = {}
    for key in environ.keys():
        if key.startswith(PREFIX):
            new_item = {key.replace(PREFIX, '', 1).lower().replace('_', ' '): environ.get(key)}
            settings.update(new_item)

    settings.update({
        'source folder': '{root}/{url}/source'.format(root=WEBSERVER_ROOT, url=site_url, ),
        'site url': site_url,
        'settings module': '{module}.{version}'.format(
            module=SETTINGS_MODULE, version=site_url.split('.')[0],
        ),
        'secret key': _make_random_sequence(50),
        'db password': _make_random_sequence(50),
        'db user': site_url.replace('.', '_'),
        'db name': site_url.replace('.', '_'),
        'user': site_url.replace('.', '_'),
        'debug toolbar internal ips': _find_my_ip_address(),
    })

    if site_url in OVERRIDES:
        settings.update(OVERRIDES[site_url])

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
    postactivate += (
        '\n'
        'export PYTHONPATH="$DJANGO_SOURCE_FOLDER:$PYTHONPATH"\n'
        'export PATH="$(dirname $DJANGO_SOURCE_FOLDER)/node_modules/.bin:$PATH"\n'
        'export PYTHONWARNINGS=ignore\n'
        'cd $DJANGO_SOURCE_FOLDER\n'
    )
    return postactivate, settings


if (__name__) == '__main__':
    # make a postactivate file for local dev server.
    make_postactivate_file(site_url='local.{}'.format(SITE_DOMAIN),)
