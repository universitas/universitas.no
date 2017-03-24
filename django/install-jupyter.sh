#!/bin/bash

REPO=https://github.com/lambdalisue/jupyter-vim-binding

# globally install jupyter
pip install jupyter

# install vim bindings for user django
su django << EOF
  mkdir -p \$(jupyter --data-dir)/nbextensions
  cd \$(jupyter --data-dir)/nbextensions
  # Clone the vim bindings repo
  git clone $REPO vim_binding
  # Activate the extension
  jupyter nbextension enable vim_binding/vim_binding
EOF
