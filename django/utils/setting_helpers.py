# -*- coding: utf-8 -*-
"""Utility functions for settings"""
import os
import logging
import json
logger = logging.getLogger(__name__)


def environment_variable(keyname, default=''):
    """Shortcut for getting environmental variables"""
    # To avoid commiting passwords and usernames to git and GitHub,
    # saved as environmental variables in a file called postactivate.
    # Postactivate is sourced when the virtual environment is activated.
    if keyname.startswith('DJANGO_'):
        keyname = keyname[7:]
    keyname = 'DJANGO_{}'.format(keyname.upper().replace(' ', '_'))
    return os.environ.get(keyname) or default




def join_path(*paths):
    """Shortcut for joining paths. cross os compatible"""
    return os.path.normpath(os.path.join(*paths))


def load_json_file(file_path):
    """Read a json file and return as a dictionary"""
    try:
        with open(file_path) as jsonfile:
            jsondict = json.load(jsonfile)
    except FileNotFoundError:
        # No file revisions found, continuing without
        # logger.exception('Could not load json file %s' % file_path)
        jsondict = {}

    return jsondict
