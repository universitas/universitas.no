# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'StoryType.prodsak_mappe'
        db.delete_column('stories_storytype', 'prodsak_mappe')

        # Adding field 'StoryType.prodsys_mappe'
        db.add_column('stories_storytype', 'prodsys_mappe',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=100),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'StoryType.prodsak_mappe'
        db.add_column('stories_storytype', 'prodsak_mappe',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=100),
                      keep_default=False)

        # Deleting field 'StoryType.prodsys_mappe'
        db.delete_column('stories_storytype', 'prodsys_mappe')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['auth.Permission']", 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission', 'ordering': "('content_type__app_label', 'content_type__model', 'codename')"},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'blank': 'True', 'max_length': '75'}),
            'first_name': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '30'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['auth.Group']", 'related_name': "'user_set'", 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '30'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['auth.Permission']", 'related_name': "'user_set'", 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'", 'ordering': "('name',)"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'stories.byline': {
            'Meta': {'object_name': 'Byline'},
            'contributor': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.Contributor']"}),
            'credit': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'story': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.Story']"})
        },
        'stories.contactinfo': {
            'Meta': {'object_name': 'ContactInfo'},
            'contact_type': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'email': ('django.db.models.fields.EmailField', [], {'blank': 'True', 'null': 'True', 'max_length': '75'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'blank': 'True', 'null': 'True', 'max_length': '200'}),
            'phone': ('django.db.models.fields.CharField', [], {'blank': 'True', 'null': 'True', 'max_length': '20'}),
            'postal_address': ('django.db.models.fields.CharField', [], {'blank': 'True', 'null': 'True', 'max_length': '200'}),
            'street_address': ('django.db.models.fields.CharField', [], {'blank': 'True', 'null': 'True', 'max_length': '200'}),
            'title': ('django.db.models.fields.CharField', [], {'blank': 'True', 'null': 'True', 'max_length': '200'}),
            'webpage': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'stories.contributor': {
            'Meta': {'object_name': 'Contributor'},
            'contact_info': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.ContactInfo']"}),
            'displayName': ('django.db.models.fields.CharField', [], {'blank': 'True', 'null': 'True', 'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'position': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.Position']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']", 'null': 'True', 'blank': 'True'})
        },
        'stories.position': {
            'Meta': {'object_name': 'Position'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50'})
        },
        'stories.printissue': {
            'Meta': {'object_name': 'PrintIssue'},
            'cover_page': ('django.db.models.fields.FilePathField', [], {'blank': 'True', 'null': 'True', 'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'issue_number': ('django.db.models.fields.CharField', [], {'max_length': '5'}),
            'pages': ('django.db.models.fields.IntegerField', [], {}),
            'pdf': ('django.db.models.fields.FilePathField', [], {'blank': 'True', 'null': 'True', 'max_length': '100'})
        },
        'stories.prodsystag': {
            'Meta': {'object_name': 'ProdsysTag'},
            'html_class': ('django.db.models.fields.CharField', [], {'blank': 'True', 'null': 'True', 'max_length': '50'}),
            'html_tag': ('django.db.models.fields.CharField', [], {'default': "'p'", 'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'xtag': ('django.db.models.fields.CharField', [], {'default': "'@tagname:'", 'unique': 'True', 'max_length': '50'})
        },
        'stories.section': {
            'Meta': {'object_name': 'Section'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50'})
        },
        'stories.story': {
            'Meta': {'object_name': 'Story'},
            'bodytext_html': ('django.db.models.fields.TextField', [], {'default': "'<p>Placeholder</p>'", 'blank': 'True'}),
            'bodytext_markup': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'bylines': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': "orm['stories.Contributor']", 'through': "orm['stories.Byline']"}),
            'dateline_date': ('django.db.models.fields.DateField', [], {'blank': 'True', 'null': 'True'}),
            'dateline_place': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'issue': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.PrintIssue']", 'null': 'True', 'blank': 'True'}),
            'lede': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'page': ('django.db.models.fields.IntegerField', [], {'blank': 'True', 'null': 'True'}),
            'pdf_url': ('django.db.models.fields.URLField', [], {'blank': 'True', 'null': 'True', 'max_length': '200'}),
            'prodsys_id': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'prodsys_json': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'publication_date': ('django.db.models.fields.DateTimeField', [], {'blank': 'True', 'null': 'True'}),
            'related_stories': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['stories.Story']", 'related_name': "'related_stories_rel_+'"}),
            'slug': ('django.db.models.fields.SlugField', [], {'default': "'slug-here'", 'max_length': '50'}),
            'status': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'story_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.StoryType']"}),
            'theme_word': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '1000'})
        },
        'stories.storychild': {
            'Meta': {'unique_together': "(('story', 'ordering', 'position'),)", 'object_name': 'StoryChild'},
            'content': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ordering': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '1'}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '1'}),
            'published': ('django.db.models.fields.NullBooleanField', [], {'default': 'True', 'blank': 'True', 'null': 'True'}),
            'story': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.Story']"})
        },
        'stories.storytype': {
            'Meta': {'object_name': 'StoryType'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50'}),
            'prodsys_mappe': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'section': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.Section']"}),
            'template': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.Story']", 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['stories']