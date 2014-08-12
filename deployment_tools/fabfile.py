""" Deployment of Django website using pyvenv-3.4 and git """
from fabric.contrib.files import append, exists, sed, put
from fabric.api import env, local, run, sudo
from generate_settings import make_postactivate_file
import os

REPO_URL = 'https://github.com/Haakenlid/tassen.git'
GIT_DJANGO_PACKAGE = 'https://github.com/django/django/archive/stable/1.7.x.zip'
PYVENV = 'pyvenv-3.4'
LINUXGROUP = 'universitas'


def deploy():
    # Folders are named something like www.example.com
    # or www.staging.example.com for production or staging
    site_name = env.host
    venv_name = site_name
    site_folder = '/srv/%s' % (site_name,)
    folders = {
        'site': site_folder,
        'source': '%s/source' % (site_folder,),
        'bin': '%s/bin' % (site_folder,),
        'static': '%s/static' % (site_folder,),
        'media': '%s/static/media' % (site_folder,),
        'venv': '%s/venv/%s' % (site_folder, venv_name),
        'logs': '%s/logs' % (site_folder,),
        'venvs': '/home/%s/.venvs/' % (env.user),
    }

    _create_directory_structure_if_necessary(folders)
    _get_latest_source(folders['source'])
    _update_virtualenv(folders['source'], folders['venv'], folders['venvs'])
    env_settings = _make_postactivate(site_name, folders['venv'], folders['bin'])
    _create_postgres_db(env_settings)
    _create_linux_user(env_settings['user'], site_name, LINUXGROUP)
    _update_static_files(folders['venv'])
    _update_database(folders['venv'])


def _make_postactivate(site_name, venv_folder, bin_folder):
    postactivate_path = '%s/postactivate' % (bin_folder,)
    activate_path = '%s/bin/activate' % (venv_folder,)
    append(activate_path, 'source %s' % (postactivate_path,))
    local_path, env_settings = make_postactivate_file(site_name, )
    put(local_path, postactivate_path)
    return env_settings


def _make_nginx_and_gunicorn_config(bin_folder, nginx_template, gunicorn_template):
    pass


def _create_directory_structure_if_necessary(folders):
    """ Ensure basic file structure in project. """
    site_folder = folders['site']
    if not exists(site_folder):
        run('mkdir -p %s' % (site_folder,))
        run('chown :%s %s' % (LINUXGROUP, site_folder))
        run('chmod 6770 %s' % (site_folder,))
    for folder in folders.values():
        run('mkdir -p %s' % (folder,))


def _get_latest_source(source_folder):
    """ Updates files on staging server with current git commit on dev branch. """
    if exists(source_folder + '/.git'):
        run('cd %s && git fetch' % (source_folder,))
    else:
        run('git clone %s %s' % (REPO_URL, source_folder))
    current_commit = local('git log -n 1 --format=%H', capture=True)
    run('cd %s && git reset --hard %s' % (source_folder, current_commit))


def _create_linux_user(username, site_name, group):
    # with settings(warn_only=True):
    user_exists = run('id %s; echo $?' % username).split()[-1] == "0"
    if not user_exists:
        sudo('useradd --shell /bin/bash -g %s -M -c "runs gunicorn for %s" %s' % (group, site_name, username))


def _create_postgres_db(env_settings):
    username = env_settings['user']
    password = env_settings['db password']
    db_name = env_settings['db name']
    databases = run(r"psql -l | grep --color=never -o '^ \w\+'").split()
    if db_name not in databases:
        print(db_name, databases)
        run('psql -c "CREATE ROLE %s NOSUPERUSER CREATEDB NOCREATEROLE LOGIN;"' % (username, ))
        run('psql -c "CREATE DATABASE %s WITH OWNER=%s  ENCODING=\'utf-8\';"' % (username, db_name, ))
    run('psql -c "ALTER ROLE %s WITH PASSWORD \'%s\';"' % (username, password, ))


def _update_virtualenv(source_folder, venv_folder, global_venv_folder):
    """ Create or update python virtual environment with the required python packages. """
    if not exists(venv_folder + '/bin/pip'):
        run('%s %s' % (PYVENV, venv_folder,))
        run('%s/bin/pip install %s' % (venv_folder, GIT_DJANGO_PACKAGE, ))
        run('ln -fs %s %s' % (venv_folder, global_venv_folder))

    run('%s/bin/pip install -r %s/requirements.txt' % (
        venv_folder, source_folder,
    ))


def _update_static_files(venv_folder):
    """ Move images, js and css to staticfolder to be served directly by nginx. """
    run('source %s/bin/activate && django-admin collectstatic --noinput' % (venv_folder,))


def _update_database(venv_folder):
    """ Run database migrations if required by changed apps. """
    run('source %s/bin/activate && django-admin migrate --noinput' % (venv_folder, ))
