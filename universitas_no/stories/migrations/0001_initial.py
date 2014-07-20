# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Story'
        db.create_table('stories_story', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('prodsys_id', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=1000)),
            ('lede', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('prodys_json', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('text_content', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('story_type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['stories.StoryType'])),
            ('dateline_place', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('dateline_date', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('publication_date', self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True)),
            ('status', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('theme_word', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=50)),
            ('issue', self.gf('django.db.models.fields.related.ForeignKey')(null=True, blank=True, to=orm['stories.PrintIssue'])),
            ('page', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('pdf_url', self.gf('django.db.models.fields.URLField')(null=True, max_length=200, blank=True)),
        ))
        db.send_create_signal('stories', ['Story'])

        # Adding M2M table for field related_stories on 'Story'
        m2m_table_name = db.shorten_name('stories_story_related_stories')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('from_story', models.ForeignKey(orm['stories.story'], null=False)),
            ('to_story', models.ForeignKey(orm['stories.story'], null=False))
        ))
        db.create_unique(m2m_table_name, ['from_story_id', 'to_story_id'])

        # Adding model 'StoryType'
        db.create_table('stories_storytype', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50, unique=True)),
            ('section', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['stories.Section'])),
            ('template', self.gf('django.db.models.fields.related.ForeignKey')(null=True, blank=True, to=orm['stories.Story'])),
        ))
        db.send_create_signal('stories', ['StoryType'])

        # Adding model 'Section'
        db.create_table('stories_section', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=50, unique=True)),
        ))
        db.send_create_signal('stories', ['Section'])

        # Adding model 'StoryChild'
        db.create_table('stories_storychild', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('story', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['stories.Story'])),
            ('content', self.gf('django.db.models.fields.TextField')()),
            ('ordering', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=1)),
            ('position', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=1)),
            ('published', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True, default=True)),
        ))
        db.send_create_signal('stories', ['StoryChild'])

        # Adding unique constraint on 'StoryChild', fields ['story', 'ordering', 'position']
        db.create_unique('stories_storychild', ['story_id', 'ordering', 'position'])

        # Adding model 'Byline'
        db.create_table('stories_byline', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('story', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['stories.Story'])),
            ('contributor', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['stories.Contributor'])),
            ('credit', self.gf('django.db.models.fields.CharField')(max_length=20)),
        ))
        db.send_create_signal('stories', ['Byline'])

        # Adding model 'Contributor'
        db.create_table('stories_contributor', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(null=True, blank=True, to=orm['auth.User'])),
            ('displayName', self.gf('django.db.models.fields.CharField')(null=True, max_length=50, blank=True)),
            ('position', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['stories.Position'])),
            ('contact_info', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['stories.ContactInfo'])),
        ))
        db.send_create_signal('stories', ['Contributor'])

        # Adding model 'ContactInfo'
        db.create_table('stories_contactinfo', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(null=True, max_length=200, blank=True)),
            ('title', self.gf('django.db.models.fields.CharField')(null=True, max_length=200, blank=True)),
            ('phone', self.gf('django.db.models.fields.CharField')(null=True, max_length=20, blank=True)),
            ('email', self.gf('django.db.models.fields.EmailField')(null=True, max_length=75, blank=True)),
            ('postal_address', self.gf('django.db.models.fields.CharField')(null=True, max_length=200, blank=True)),
            ('street_address', self.gf('django.db.models.fields.CharField')(null=True, max_length=200, blank=True)),
            ('webpage', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('contact_type', self.gf('django.db.models.fields.CharField')(max_length=50)),
        ))
        db.send_create_signal('stories', ['ContactInfo'])

        # Adding model 'Position'
        db.create_table('stories_position', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=50, unique=True)),
        ))
        db.send_create_signal('stories', ['Position'])

        # Adding model 'PrintIssue'
        db.create_table('stories_printissue', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('issue_number', self.gf('django.db.models.fields.CharField')(max_length=5)),
            ('pages', self.gf('django.db.models.fields.IntegerField')()),
            ('pdf', self.gf('django.db.models.fields.FilePathField')(null=True, max_length=100, blank=True)),
            ('cover_page', self.gf('django.db.models.fields.FilePathField')(null=True, max_length=100, blank=True)),
        ))
        db.send_create_signal('stories', ['PrintIssue'])

        # Adding model 'ProdsysTag'
        db.create_table('stories_prodsystag', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('xtag', self.gf('django.db.models.fields.CharField')(max_length=50, default='@tagname:', unique=True)),
            ('html_tag', self.gf('django.db.models.fields.CharField')(max_length=50, default='p')),
            ('html_class', self.gf('django.db.models.fields.CharField')(null=True, max_length=50, blank=True)),
        ))
        db.send_create_signal('stories', ['ProdsysTag'])


    def backwards(self, orm):
        # Removing unique constraint on 'StoryChild', fields ['story', 'ordering', 'position']
        db.delete_unique('stories_storychild', ['story_id', 'ordering', 'position'])

        # Deleting model 'Story'
        db.delete_table('stories_story')

        # Removing M2M table for field related_stories on 'Story'
        db.delete_table(db.shorten_name('stories_story_related_stories'))

        # Deleting model 'StoryType'
        db.delete_table('stories_storytype')

        # Deleting model 'Section'
        db.delete_table('stories_section')

        # Deleting model 'StoryChild'
        db.delete_table('stories_storychild')

        # Deleting model 'Byline'
        db.delete_table('stories_byline')

        # Deleting model 'Contributor'
        db.delete_table('stories_contributor')

        # Deleting model 'ContactInfo'
        db.delete_table('stories_contactinfo')

        # Deleting model 'Position'
        db.delete_table('stories_position')

        # Deleting model 'PrintIssue'
        db.delete_table('stories_printissue')

        # Deleting model 'ProdsysTag'
        db.delete_table('stories_prodsystag')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '80', 'unique': 'True'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'blank': 'True', 'symmetrical': 'False'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'object_name': 'Permission', 'unique_together': "(('content_type', 'codename'),)"},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'related_name': "'user_set'", 'blank': 'True', 'symmetrical': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'related_name': "'user_set'", 'blank': 'True', 'symmetrical': 'False'}),
            'username': ('django.db.models.fields.CharField', [], {'max_length': '30', 'unique': 'True'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'db_table': "'django_content_type'", 'object_name': 'ContentType', 'unique_together': "(('app_label', 'model'),)"},
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
            'email': ('django.db.models.fields.EmailField', [], {'null': 'True', 'max_length': '75', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'null': 'True', 'max_length': '200', 'blank': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'null': 'True', 'max_length': '20', 'blank': 'True'}),
            'postal_address': ('django.db.models.fields.CharField', [], {'null': 'True', 'max_length': '200', 'blank': 'True'}),
            'street_address': ('django.db.models.fields.CharField', [], {'null': 'True', 'max_length': '200', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'null': 'True', 'max_length': '200', 'blank': 'True'}),
            'webpage': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'stories.contributor': {
            'Meta': {'object_name': 'Contributor'},
            'contact_info': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.ContactInfo']"}),
            'displayName': ('django.db.models.fields.CharField', [], {'null': 'True', 'max_length': '50', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'position': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.Position']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'null': 'True', 'blank': 'True', 'to': "orm['auth.User']"})
        },
        'stories.position': {
            'Meta': {'object_name': 'Position'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50', 'unique': 'True'})
        },
        'stories.printissue': {
            'Meta': {'object_name': 'PrintIssue'},
            'cover_page': ('django.db.models.fields.FilePathField', [], {'null': 'True', 'max_length': '100', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'issue_number': ('django.db.models.fields.CharField', [], {'max_length': '5'}),
            'pages': ('django.db.models.fields.IntegerField', [], {}),
            'pdf': ('django.db.models.fields.FilePathField', [], {'null': 'True', 'max_length': '100', 'blank': 'True'})
        },
        'stories.prodsystag': {
            'Meta': {'object_name': 'ProdsysTag'},
            'html_class': ('django.db.models.fields.CharField', [], {'null': 'True', 'max_length': '50', 'blank': 'True'}),
            'html_tag': ('django.db.models.fields.CharField', [], {'max_length': '50', 'default': "'p'"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'xtag': ('django.db.models.fields.CharField', [], {'max_length': '50', 'default': "'@tagname:'", 'unique': 'True'})
        },
        'stories.section': {
            'Meta': {'object_name': 'Section'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50', 'unique': 'True'})
        },
        'stories.story': {
            'Meta': {'object_name': 'Story'},
            'bylines': ('django.db.models.fields.related.ManyToManyField', [], {'through': "orm['stories.Byline']", 'to': "orm['stories.Contributor']", 'symmetrical': 'False'}),
            'dateline_date': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'dateline_place': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'issue': ('django.db.models.fields.related.ForeignKey', [], {'null': 'True', 'blank': 'True', 'to': "orm['stories.PrintIssue']"}),
            'lede': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'page': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'pdf_url': ('django.db.models.fields.URLField', [], {'null': 'True', 'max_length': '200', 'blank': 'True'}),
            'prodsys_id': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'prodys_json': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'publication_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'related_stories': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'related_stories_rel_+'", 'to': "orm['stories.Story']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'}),
            'status': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'story_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.StoryType']"}),
            'text_content': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'theme_word': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '1000'})
        },
        'stories.storychild': {
            'Meta': {'object_name': 'StoryChild', 'unique_together': "(('story', 'ordering', 'position'),)"},
            'content': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ordering': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '1'}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '1'}),
            'published': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True', 'default': 'True'}),
            'story': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.Story']"})
        },
        'stories.storytype': {
            'Meta': {'object_name': 'StoryType'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'unique': 'True'}),
            'section': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['stories.Section']"}),
            'template': ('django.db.models.fields.related.ForeignKey', [], {'null': 'True', 'blank': 'True', 'to': "orm['stories.Story']"})
        }
    }

    complete_apps = ['stories']