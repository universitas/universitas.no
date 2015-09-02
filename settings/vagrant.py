""" Settings for development on a hosted vagrant machine. """

from .dev import *

INTERNAL_IPS = ['127.0.0.1', ]
NOTEBOOK_ARGUMENTS += ['--ip=0.0.0.0', ]
RUNSERVERPLUS_SERVER_ADDRESS_PORT = '0.0.0.0:8000'
