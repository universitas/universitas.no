#!/bin/bash
source "$($(dirname "$0")/find_activate_script.sh)"
django-admin web_pdf 
