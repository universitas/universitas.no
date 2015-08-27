# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.views.generic.base import RedirectView

urlpatterns = [
    url(r'^(?P<base>.+)/hl:.+$', RedirectView.as_view(url=r'/%(base)s/')),
]
