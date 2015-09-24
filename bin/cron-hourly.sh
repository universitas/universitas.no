#!/bin/bash
source $(find_activate_script.sh)
django-admin devalue_hotness &> /dev/null
