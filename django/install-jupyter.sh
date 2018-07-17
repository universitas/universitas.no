#!/bin/bash

REPO=https://github.com/lambdalisue/jupyter-vim-binding

# globally install jupyter
pip install --no-cache jupyter ipywidgets tqdm

# install vim bindings for user 1000

su $(id -nu 1000) << EOF
  mkdir -p \$(jupyter --data-dir)/nbextensions
  cd \$(jupyter --data-dir)/nbextensions
  # Clone the vim bindings repo
  git clone $REPO vim_binding
  # Activate the extension
  jupyter nbextension enable vim_binding/vim_binding
  jupyter nbextension enable --py widgetsnbextension
EOF
