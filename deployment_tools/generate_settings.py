# -*- coding: utf-8 -*-
import random
import re
from os import environ, path


PREFIX = 'DJANGO_'  # Environment variable prefix
SETTINGS_PATH = 'universitas_no.settings'  # Name of app folder in project
WEBSERVER_ROOT = '/srv'  # Location of each django project
OVERRIDES = {
    'www.universitas.no': {
        'settings module': '%s.production' % (SETTINGS_PATH,) ,
        'allowed hosts': 'universitas.no',
    },
    'staging.universitas.no': {
        'settings module': '%s.production' % (SETTINGS_PATH,) ,
    },
}


def make_postactivate_file(site_url, file_path=None):
    """ Make a postactivate file and return settings as a dictionary. """
    if file_path is None:
        file_path = '%s/postactivate.%s' % (path.dirname(__file__), site_url)
    contents, settings = make_postactivate_text(site_url)
    with open(file_path, 'w') as f:
        f.write(contents)

    return file_path, settings


def _make_random_sequence(length=50):
    """ Generate a random string for secret key or password """
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return ''.join(random.SystemRandom().choice(chars) for n in range(length))


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
        'source folder': '%s/%s/source' % (WEBSERVER_ROOT, site_url, ),
        'site url': site_url,
        'settings module': '%s.%s' % (
            SETTINGS_PATH,
            site_url.split('.')[0],
        ),
        'secret key': _make_random_sequence(50),
        'db password': _make_random_sequence(50),
        'db user': site_url.replace('.', '_'),
        'db name': site_url.replace('.', '_'),
        'user': site_url.replace('.', '_'),
        # "wsgi module": "%s.wsgi" % (DJANGO_APP_NAME,),
    })

    if site_url in OVERRIDES:
        settings.update(OVERRIDES[site_url])

    postactivate = (
        '#!/bin/bash\n'
        '# This hook is run after the virtualenv is activated.\n\n'
        '# Environmental varibales for django projects.\n\n'
    )
    for key in sorted(settings):
        postactivate += 'export %s%s="%s"\n' % (
            PREFIX,
            key.replace(' ', '_').upper(),
            settings[key],
        )
    postactivate += (
        '\n'
        'export PYTHONPATH="$DJANGO_SOURCE_FOLDER:$PYTHONPATH:"\n'
        'cd $DJANGO_SOURCE_FOLDER\n'
    )
    return postactivate, settings


if __name__ == '__main__':
    make_postactivate_file('local.universitas.no', './postactivate')
