class ProdsysRouter(object):
    """
    A router to control access to the legacy prodsys database.

    IMPORTANT: This database should be read only, so we don't mess up anything.
    """
    def db_for_read(self, model, **hints):
        """
        Attempts to read auth models go to auth_db.
        """
        if model._meta.app_label == 'legacy_db':
            return 'prodsys'
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write auth models go to auth_db.
        """
        if model._meta.app_label == 'legacy_db':
            return 'prodsys'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):

        """
        Make sure the auth app only appears in the 'auth_db'
        database.
        """
        if db == 'prodsys':
            return app_label == 'legacy_db'
        elif app_label == 'legacy_db':
            return False
        return None
