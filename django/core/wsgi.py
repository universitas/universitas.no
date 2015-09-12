# -*- coding: utf-8 -*-
"""
WSGI config for universitas_no project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

# This is set by the virtualenv instead
# import os
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "universitas_no.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
