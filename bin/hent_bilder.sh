#!/bin/bash
LOCAL_FOLDER="/srv/fotoarkiv_universitas/"
REMOTE_FOLDER="www/bilder/"
rsync -uvr universitas@login.domeneshop.no:$REMOTE_FOLDER $LOCAL_FOLDER --exclude='_*' 
sudo find $LOCAL_FOLDER -type d -print0 | sudo xargs -0 chmod 6774
sudo find $LOCAL_FOLDER -type f -print0 | sudo xargs -0 chmod 664
