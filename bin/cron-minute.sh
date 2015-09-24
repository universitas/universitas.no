#!/bin/bash
source $(find_activate_script.sh)
django-admin importer_fra_prodsys -p &> /dev/null
