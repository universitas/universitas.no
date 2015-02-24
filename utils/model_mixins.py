from django.core.urlresolvers import reverse


class Edit_url_mixin:

    def get_edit_url(self):
        """ Url to django admin for this object """
        url = reverse(
            'admin:{app}_{object}_change'.format(
                app=self._meta.app_label,
                object=self._meta.model_name,
            ),
            args=[self.id],
        )
        return url
