# parent image based on python:3-stretch
FROM haakenlid/jupyter-opencv:3.6
LABEL maintainer="haakenlid"
WORKDIR /app/
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# create user to run app
RUN groupadd --gid 1000 django &&\
  useradd --uid 1000 --gid 1000 --shell /bin/bash --create-home django

# copy files
COPY requirements.txt docker-entrypoint.sh /app/

# install pdf utils and database clients
RUN apt-get update && apt-get install --yes --no-install-recommends \
  rsync \
  gettext \
  ghostscript \
  poppler-utils \
  postgresql-client \
&& rm -rf /var/lib/apt/lists/*

# create `var` folders that django uses
RUN cd /var && mkdir staging media static logs &&\
  chown 1000:1000 staging media static logs

# install python dependencies for django
RUN pip install --no-cache -r /app/requirements.txt

# set up ptpython with persistent history and custom config
RUN mkdir /home/django/.ptpython &&\
    ln -s /var/logs/.ptpython_history /home/django/.ptpython_history &&\
    ln -s /app/ptpython_config.py /home/django/.ptpython/config.py

# set up imagemagick policy to enable more RAM usage
RUN sed -i '/name="memory"/s/256MiB/1GiB/' /etc/ImageMagick-6/policy.xml &&\
    sed -i '/name="disk"/s/1GiB/4GiB/' /etc/ImageMagick-6/policy.xml

