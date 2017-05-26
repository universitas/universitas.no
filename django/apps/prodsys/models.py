from django.utils.translation import ugettext_lazy as _
from django.db import models


class ProdsakQueryset(models.QuerySet):

    def single(self):
        latest = self.extra(where=[
            '(prodsak_id, version_no) IN '
            '(SELECT prodsak_id, MAX(version_no) '
            'FROM prodsak GROUP BY prodsak_id) '
        ])
        return latest

    def active(self):
        return self.exclude(produsert=Prodsak.ARCHIVED)


class ProdsakManager(models.Manager):

    def get_queryset(self):
        return ProdsakQueryset(self.model, using=self._db)

    def single(self):
        return self.get_queryset().single()

    def active(self):
        return self.get_queryset().active().order_by('-prodsak_id').single()


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
    produsert = models.IntegerField(
        blank=True, null=True, choices=PRODUSERT_CHOICES)
    dato = models.DateTimeField()
    version_no = models.IntegerField(editable=False,)
    version_date = models.DateTimeField(editable=False, blank=True, null=True)
    timelock = models.DateTimeField(editable=False, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'prodsak'
        verbose_name = _('prodsys sak')
        verbose_name_plural = _('prodsys saker')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        versions = Prodsak.objects.filter(prodsak_id=self.prodsak_id)
        versions.update(produsert=self.produsert)

    def __str__(self):
        return '{s.prodsak_id}({s.version_no}) {s.arbeidstittel}'.format(
            s=self)


class Prodbilde(models.Model):
    prodbilde_id = models.IntegerField(primary_key=True)
    prodsak_id = models.IntegerField(blank=True, null=True)
    bildefil = models.TextField(blank=True)
    bildetekst = models.TextField(blank=True)
    kommentar = models.TextField(blank=True)
    prioritet = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'prodbilde'
        verbose_name = _('prodsys bilde')
        verbose_name_plural = _('prodsys bilder')
