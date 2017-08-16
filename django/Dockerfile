FROM haakenlid/opencv:3.6
MAINTAINER haakenlid

# create user to run app
RUN groupadd --gid 1000 django \
  && useradd --uid 1000 --gid 1000 --shell /bin/bash --create-home django

# install pdf utils and database clients
RUN apt-get install -y \
  ghostscript \
  poppler-utils \
  postgresql-client \
  mysql-client

# copy files
COPY requirements.txt install-jupyter.sh docker-entrypoint.sh /app/

# install python dependencies for django
RUN pip install --no-cache wheel && pip install --no-cache -r /app/requirements.txt
# bug fix. This package is not needed since python 3.6
RUN pip uninstall -y enum34

# install jupyter notebook with vim key bindings
RUN /app/install-jupyter.sh

RUN cd /var && mkdir staging media static logs &&\
    chown 1000:1000 staging media static logs &&\
    mkdir /home/django/.ptpython &&\
    ln -s /var/logs/.ptpython_history /home/django/.ptpython_history &&\
    ln -s /app/ptpython_config.py /home/django/.ptpython/config.py

WORKDIR /app/
ENTRYPOINT ["/app/docker-entrypoint.sh"]
