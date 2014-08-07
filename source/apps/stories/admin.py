# -*- coding: utf-8 -*-
"""
Admin for stories app.
"""

from django.contrib import admin
from . import models
from utils.autoregister import autoregister_admin

autoregister_admin(models)
