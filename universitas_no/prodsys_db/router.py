class ProdsysRouter(object):
    """
    A router to control all database operations on models in the
    auth application.
    """
    def db_for_read(self, model, **hints):
        """
        Attempts to read auth models go to auth_db.
        """
        if model._meta.app_label == 'prodsys_db':
            return 'prodsys'
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write auth models go to auth_db.
        """
        if model._meta.app_label == 'prodsys_db':
            return 'prodsys'
        return None

    def allow_migrate(self, db, model):
        """
        Make sure the auth app only appears in the 'auth_db'
        database.
        """
        if db == 'prodsys':
            return model._meta.app_label == 'prodsys_db'
        elif model._meta.app_label == 'prodsys_db':
            return False
        return None