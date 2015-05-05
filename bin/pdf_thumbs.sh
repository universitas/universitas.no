#!/bin/bash

# load environmental variables.
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source $DIR/cron_environment_variables.sh

size=1000
thumbs_folder="$PDF_FOLDER/thumbs"
mkdir -p "$thumbs_folder"

cd "$PDF_FOLDER"

for pdf_file in UNI11VER*000.pdf; do
  thumbfile="$thumbs_folder"/$(echo "$pdf_file"\
    | sed -r "s/UNI11VER.{6}(..)000.pdf/universitas-$YEAR-nr$ISSUE-s\1.jpg/")
  if [[ ! -f "$thumbfile" || "$pdf_file" -nt "$thumbfile" ]]; then
    convert \
      -density 160 \
      -colorspace CMYK \
      "$pdf_file"\
      -background white \
      -flatten \
      -resize "$size"x \
      -format jpg \
      -colorspace sRGB \
      "$thumbfile"
  fi
done
