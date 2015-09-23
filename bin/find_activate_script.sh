#!/bin/bash
# load environmental variables.
cd "$(dirname "${BASH_SOURCE[0]}")" 
cd ../pyvenv
echo $(find $(pwd) -wholename "*/bin/activate")
