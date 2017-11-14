# parent image based on python:3.6 (debian)
FROM haakenlid/opencv:3.6
MAINTAINER haakenlid

# create user to run app
RUN groupadd --gid 1000 django &&\
  useradd --uid 1000 --gid 1000 --shell /bin/bash --create-home django

# create `var` folders that django uses
RUN cd /var && mkdir staging media static logs &&\
  chown 1000:1000 staging media static logs

# install pdf utils and database clients
RUN apt-get update && install -y \
  gettext \
  ghostscript \
  poppler-utils \
  postgresql-client

# copy files
COPY requirements.txt install-jupyter.sh docker-entrypoint.sh /app/

# install python dependencies for django
RUN pip install --no-cache wheel && pip install --no-cache -r /app/requirements.txt

# install jupyter notebook with vim key bindings
RUN /app/install-jupyter.sh

# set up ptpython with persistent history and custom config
RUN mkdir /home/django/.ptpython &&\
    ln -s /var/logs/.ptpython_history /home/django/.ptpython_history &&\
    ln -s /app/ptpython_config.py /home/django/.ptpython/config.py

WORKDIR /app/
ENTRYPOINT ["/app/docker-entrypoint.sh"]
