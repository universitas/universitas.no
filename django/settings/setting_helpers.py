# -*- coding: utf-8 -*-
"""Utility functions for settings"""
import os
import json
import logging
logger = logging.getLogger(__name__)


def environment_variable(keyname):
    """shortcut for getting environmental variables"""
    # To avoid commiting passwords and usernames to git and GitHub,
    # these settings are saved as environmental variables in a file called postactivate.
    # Postactivate is sourced when the virtual environment is activated.
    if keyname.startswith('DJANGO_'):
        keyname = keyname[7:]
    keyname = 'DJANGO_{}'.format(keyname.upper().replace(' ', '_'))
    return os.environ.get(keyname) or ''


def join_path(*paths):
    """ shortcut for joining paths. cross os compatible """
    return os.path.normpath(os.path.join(*paths))


def load_json_file(filepath):
    """Load json file -> dictionary"""
    try:
        with open(filepath) as filerevs_fh:
            jsondict = json.load(filerevs_fh)
    except IOError as err:
        # No file revisions found, continuing without
        logger.exception('%s' % err)
        jsondict = {}
    return jsondict
