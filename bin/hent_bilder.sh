#!/bin/bash
LOCAL_FOLDER="/srv/fotoarkiv_universitas/"
REMOTE_FOLDER="www/bilder/"
echo 'copy files'
rsync -uvr universitas@login.domeneshop.no:$REMOTE_FOLDER $LOCAL_FOLDER --exclude='_*'
echo 'fix permissions'
find $LOCAL_FOLDER -type d -print0 | xargs -0 chmod 6774
find $LOCAL_FOLDER -type f -print0 | xargs -0 chmod 664
