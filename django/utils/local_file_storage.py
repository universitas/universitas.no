from django.core.files.storage import FileSystemStorage


class OverwriteStorage(FileSystemStorage):

    """ Overwrite file if exists """

    def get_available_name(self, name, *args, **kwargs):
        self.delete(name)
        return super().get_available_name(name, *args, **kwargs)
