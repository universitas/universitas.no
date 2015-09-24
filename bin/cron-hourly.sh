#!/bin/bash
virtualenvfolder=/srv/www.universitas.no/venv/www.universitas.no
source $virtualenvfolder/bin/activate
django-admin importer_fra_prodsys -p &> /dev/null
