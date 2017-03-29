FROM haakenlid/opencv:3.6
MAINTAINER haakenlid

# create user to run app
RUN groupadd --gid 1000 django \
  && useradd --uid 1000 --gid 1000 --shell /bin/bash --create-home django

# install pdf utils and database client
RUN apt-get install -y \
  ghostscript \
  poppler-utils \
  postgresql-client

# copy files
COPY requirements.txt install-jupyter.sh docker-entrypoint.sh /app/

# install python dependencies for django
RUN pip install --no-cache wheel && pip install --no-cache -r /app/requirements.txt

# install jupyter notebook with vim key bindings
RUN /app/install-jupyter.sh

RUN cd /var && mkdir staging media static logs && chown django:django staging media static logs

WORKDIR /app/
ENTRYPOINT ["/app/docker-entrypoint.sh"]
