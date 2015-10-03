# -*- coding: utf-8 -*-
"""
WSGI config for universitas_no project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

# from raven.contrib.django.raven_compat.middleware.wsgi import Sentry
from django.core.wsgi import get_wsgi_application

# application = Sentry(get_wsgi_application())
application = get_wsgi_application()