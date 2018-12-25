# parent image based on python:3-stretch
FROM haakenlid/jupyter-opencv:3.6
LABEL maintainer="haakenlid"
ENTRYPOINT ["/app/docker-entrypoint.sh"]
WORKDIR /app/

# set up imagemagick policy to enable more RAM usage
RUN sed -i '/name="memory"/s/256MiB/1GiB/' /etc/ImageMagick-6/policy.xml \
  && sed -i '/name="disk"/s/1GiB/4GiB/' /etc/ImageMagick-6/policy.xml \
  ;

# create user to run app and create volume directories in /var
# also set symlinks to ptpython config and histoy log
RUN groupadd --gid 1000 django \
  && useradd --uid 1000 --gid 1000 --shell /bin/bash --create-home django \
  && install -d -o django -g django /home/django/.ptpython \
  && ln -s /var/logs/.ptpython_history /home/django/.ptpython_history \
  && ln -s /app/ptpython_config.py /home/django/.ptpython/config.py \
  && cd /var && install -d -o django -g django staging media static logs \
  ;

# install database client and other utils from apt
RUN apt-get update \
  && apt-get install --yes --no-install-recommends \
  gettext \
  ghostscript \
  poppler-utils \
  postgresql-client \
  rsync \
  && rm -rf /var/lib/apt/lists/* \
  ;

# install python dependencies for django
COPY requirements.txt /app/
RUN pip install --no-cache -r requirements.txt \
  && rm requirements.txt \
  ;
