# -*- coding: utf-8 -*-
"""
WSGI config for universitas_no project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

from raven.contrib.django.raven_compat.middleware.wsgi import Sentry
from django.core.wsgi import get_wsgi_application

application = Sentry(get_wsgi_application())
