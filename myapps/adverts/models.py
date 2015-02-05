# -*- coding: utf-8 -*-
import logging
from django.db import models

from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _

logger = logging.getLogger('universitas')

class Location(models.Model):
    """ Location for ads to be placed. """
    label = models.CharField(unique=True, max_length=50)
    description = models.TextField()
    width = models.PositiveSmallIntegerField()
    height = models.PositiveSmallIntegerField()
    extra_classes = models.CharField(blank=True, max_length=50)

    class Meta:
        verbose_name = _("Location")
        verbose_name_plural = _("Locations")

    def __str__(self):
        return self.label


class Customer(models.Model):
    """ Buyer of the ad """
    name = models.CharField(max_length=500)
    contact_info = models.TextField(blank=True)

    class Meta:
        verbose_name = _("Customer")
        verbose_name_plural = _("Customers")

    def __str__(self):
        return self.name


class Advert(models.Model):
    """ Individial ads """
    customer = models.ForeignKey(Customer)
    location = models.ForeignKey(Location)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        verbose_name = _("Advert")
        verbose_name_plural = _("Adverts")

    def __str__(self):
        return '{customer}: {start_time}'.format(
            customer=self.customer,
            start_time=self.start_time,
            )
