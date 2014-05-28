"""
Kontakte prodsys.
"""

import requests


class Prodsys(object):
    """Leser fra prodsys over web-api."""
    def __init__(self, arg):
        super(Prodsys, self).__init__()
        self.arg = arg

    USERNAME = "api"
    PASSWORD = "avier1gi"
    # http://universitas.no/admin/api/indesign/18566/json/
    URL = "http://universitas.no:80/api/indesign/%d/json/"
    PRODSYS_ID = 18658

    print(URL % PRODSYS_ID)
    r = requests.get(URL % PRODSYS_ID, auth=(USERNAME, PASSWORD))
    print(r.status)
    print(r.json()["tekst"])

