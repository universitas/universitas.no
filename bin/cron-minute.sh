#!/bin/bash
source "$($(dirname "$0")/find_activate_script.sh)"
django-admin importer_fra_prodsys -p &> /dev/null
