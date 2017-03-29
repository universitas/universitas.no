class ProdsysRouter(object):
    """
    A router to control access to the legacy prodsys database.
    """

    def db_for_read(self, model, **hints):
        """
        Attempts to read prodsys models go to prodsys database
        """
        if model._meta.app_label == 'legacy_db':
            return 'prodsys'
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write prodsys models go to prodsys database
        """
        if model._meta.app_label == 'legacy_db':
            return 'prodsys'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Allow migrations
        """
        response = None
        if db == 'prodsys':
            response = (app_label == 'legacy_db')
        else:
            response = (app_label != 'legacy_db')
        return response
