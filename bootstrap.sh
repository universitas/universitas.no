#! /bin/bash
apt-get install -y git

git config --global url."https://".insteadOf git://
sudo -u vagrant git config --global url."https://".insteadOf git://

# add dotfiles from Håkens github repo
DOTFILES_FOLDER="/home/vagrant/.dotfiles"
if [[ ! -e $DOTFILES_FOLDER ]]; then
  git clone https://github.com/haakenlid/dotfiles $DOTFILES_FOLDER
  $DOTFILES_FOLDER/bin/dotfiles
  chown -R vagrant:vagrant /home/vagrant/
fi

# programs
apt-get install -y \
python-dev \
supervisor \
postgresql \
postgresql-contrib \
virtualenvwrapper \
logrotate \
make \
nginx \
redis-server \
graphicsmagick-imagemagick-compat \
graphviz \
graphviz-dev \
libgraphviz-dev \
libjpeg-dev \
libpq-dev \
nmap \
dtach \
nodejs-legacy \
npm
# python3-pip \
# python3.4-dev

# setup webserver folder for source code and resources.
mkdir -p /srv
chmod 6775 /srv /srv/*
chown vagrant:www-data /srv /srv/*

groupadd -f www
usermod -aG www-data vagrant
usermod -aG www vagrant

# setup vagrant user in postgres
su postgres << HERE
  if ! psql vagrant -c '' &> /dev/null
  then # vagrant database user does not exist yet.
    psql -c "CREATE ROLE vagrant SUPERUSER LOGIN;"
    psql -c "CREATE DATABASE vagrant WITH OWNER vagrant;"
  fi
HERE
