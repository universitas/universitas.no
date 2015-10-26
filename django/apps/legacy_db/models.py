# -*- coding: utf-8 -*-

# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [app_label]'
# into your database.
# from __future__ import unicode_literals

from django.utils.translation import ugettext_lazy as _
from django.db import models


class Sak(models.Model):
    id_sak = models.IntegerField(primary_key=True)
    publisert = models.IntegerField()

    overskrift = models.CharField(max_length=255)
    stikktittel = models.CharField(max_length=255, blank=True)
    ingress = models.TextField()
    temaord = models.CharField(max_length=255, blank=True)
    byline = models.CharField(max_length=255)
    brodtekst = models.TextField()

    undersak = models.IntegerField(blank=True, null=True)
    mappe = models.CharField(max_length=255, blank=True)
    sitat = models.TextField(blank=True)

    subtittel1 = models.CharField(max_length=255, blank=True)
    subtittel2 = models.CharField(max_length=255, blank=True)
    subtittel3 = models.CharField(max_length=255, blank=True)
    subtittel4 = models.CharField(max_length=255, blank=True)

    dato = models.DateField()
    prioritetdato = models.DateTimeField(blank=True, null=True)
    filnavn = models.CharField(max_length=255, blank=True)

    prioritet = models.IntegerField()
    lesninger = models.IntegerField()
    tipsninger = models.IntegerField()
    diskusjon = models.IntegerField()

    nettoverskrift = models.CharField(max_length=255, blank=True)
    nettingress = models.TextField(blank=True)
    nettstikktittel = models.CharField(max_length=255, blank=True)

    slagord = models.CharField(max_length=255, blank=True)
    fancyoverskrift = models.CharField(max_length=255, blank=True)

    class Meta:
        managed = False
        db_table = 'sak'
        verbose_name = _('websak')
        verbose_name_plural = _('websaker')

    def __str__(self):
        return self.overskrift


class Bildetekst(models.Model):
    id_bildetekst = models.IntegerField(primary_key=True)
    tekst = models.TextField()
    # id_sak = models.IntegerField(blank=True, null=True)
    id_sak = models.ForeignKey(Sak, db_column='id_sak', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'bildetekst'
        verbose_name = _('bildetekst')
        verbose_name_plural = _('bildetekster')

    def __str__(self):
        return self.tekst


class Bilde(models.Model):
    id_bilde = models.IntegerField(primary_key=True)
    path = models.CharField(max_length=255)
    sak = models.ForeignKey(Sak, db_column='id_sak', blank=True, null=True)
    bildetekst = models.ForeignKey(Bildetekst, db_column='id_bildetekst', blank=True, null=True)
    size = models.IntegerField(db_column='str', blank=True, null=True)
    crop = models.IntegerField()

    def __str__(self):
        return self.path

    class Meta:
        managed = False
        db_table = 'bilder'
        verbose_name = _('bilde')
        verbose_name_plural = _('bilder')


class InnleggAbstract(models.Model):

    navn = models.CharField(max_length=128)
    tekst = models.TextField()
    sensurert = models.IntegerField(blank=True, null=True)
    tid = models.DateTimeField()
    epost = models.CharField(max_length=255, blank=True)
    ip = models.CharField(max_length=16, blank=True)
    status = models.IntegerField()

    class Meta:
        abstract = True


class DiskInnlegg(InnleggAbstract):
    id_innlegg = models.IntegerField(primary_key=True)

    tittel = models.CharField(max_length=255, blank=True)
    sak = models.ForeignKey(Sak, db_column='sak', blank=True, null=True)
    lesninger = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'disk_innlegg'
        verbose_name = _('diskusjon innlegg')
        verbose_name_plural = _('diskusjon innlegg')


class DiskSvar(InnleggAbstract):
    id_svar = models.IntegerField(primary_key=True)
    innlegg = models.ForeignKey(DiskInnlegg, db_column='id_innlegg', blank=True, null=True)
    sak = models.ForeignKey(Sak, db_column='sak_id', blank=True, null=True)
    epost_sendt = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'disk_svar'
        verbose_name = _('diskusjon svar')
        verbose_name_plural = _('diskusjon svar')


class Eposttinging(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    epost = models.CharField(max_length=255)
    oppretta = models.DateTimeField()
    stoppa = models.DateTimeField(blank=True, null=True)
    # sak_id = models.IntegerField()
    sak = models.ForeignKey(Sak, db_column='sak_id')

    class Meta:
        managed = False
        db_table = 'eposttinging'
        verbose_name = _('eposttinging')
        verbose_name_plural = _('eposttingingar')


class Fakta(models.Model):
    id_fakta = models.IntegerField(primary_key=True)
    tekst = models.TextField()
    # id_sak = models.IntegerField()
    sak = models.ForeignKey(Sak, db_column='id_sak')

    class Meta:
        managed = False

        db_table = 'fakta'
        verbose_name = _('faktaboks')
        verbose_name_plural = _('faktabokser')


class ProdsakQueryset(models.QuerySet):

    def single(self):
        latest = self.extra(
            where=[
                ''' (prodsak_id, version_no) IN (
                SELECT prodsak_id, MAX(version_no)
                FROM prodsak
                GROUP BY prodsak_id
                ) '''
            ]
        )
        return latest

    def active(self):
        return self.exclude(produsert=Prodsak.ARCHIVED)

class ProdsakManager(models.Manager):

    def get_queryset(self):
        return ProdsakQueryset(self.model, using=self._db)

    def single(self):
        return self.get_queryset().latest_version()

    def active(self):
        return self.get_queryset(
            ).active(
            ).order_by('-prodsak_id'
            ).single()


class Prodsak(models.Model):

    DRAFT = 0
    OLD_DRAFT = 1
    READY_FOR_PRINT = 3
    IMPORTED_TO_INDESIGN = 4
    EXPORTED_FROM_INDESIGN = 6
    READY_FOR_WEB = 7
    PUBLISHED_ON_WEB = 8
    ARCHIVED = 9

    PRODUSERT_CHOICES = (
        (DRAFT, 'i arbeid',),
        (OLD_DRAFT, 'overligger',),
        (READY_FOR_PRINT, 'til desk',),
        (IMPORTED_TO_INDESIGN, 'gammel desk',),
        (EXPORTED_FROM_INDESIGN, 'edit2web',),
        (READY_FOR_WEB, 'til web',),
        (PUBLISHED_ON_WEB, 'gammel web',),
        (ARCHIVED, 'slettet',),
    )

    FLAGG_CHOICES = (
        (1, 'Journalist'),
        (2, 'Mellomleder'),
        (3, 'Redaksjonsleder'),
        (4, 'Redaktør'),
    )

    objects = ProdsakManager()

    prodsak_id = models.IntegerField(editable=False)
    arbeidstittel = models.CharField(max_length=200, blank=True)
    journalist = models.CharField(max_length=50, blank=True)
    tekst = models.TextField(blank=True)
    kommentar = models.TextField(blank=True)
    mappe = models.CharField(max_length=100, blank=True)
    flagg = models.IntegerField(blank=True, null=True, choices=FLAGG_CHOICES)
    produsert = models.IntegerField(blank=True, null=True, choices=PRODUSERT_CHOICES)
    dato = models.DateTimeField()
    version_no = models.IntegerField(editable=False,)
    version_date = models.DateTimeField(editable=False, blank=True, null=True)
    timelock = models.DateTimeField(editable=False, blank=True, null=True)

    class Meta:
        # ordering = ['produsert']
        managed = False
        db_table = 'prodsak'
        verbose_name = _('prodsys sak')
        verbose_name_plural = _('prodsys saker')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        versions = Prodsak.objects.filter(prodsak_id=self.prodsak_id)
        versions.update(produsert=self.produsert)

    def __str__(self):
        return '{s.prodsak_id}({s.version_no}) {s.arbeidstittel}'.format(s=self)


class Prodbilde(models.Model):
    prodbilde_id = models.IntegerField(primary_key=True)
    prodsak_id = models.IntegerField(blank=True, null=True)
    # prodsak_id = models.ForeignKey(Prodsak, db_column='prodsak_id' ,blank=True, null=True)
    bildefil = models.TextField(blank=True)
    bildetekst = models.TextField(blank=True)
    kommentar = models.TextField(blank=True)
    prioritet = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'prodbilde'
        verbose_name = _('prodsys bilde')
        verbose_name_plural = _('prodsys bilder')
