""" Deployment of Django website using pyvenv-3.4 and git """
from fabric.contrib.files import append, exists, put
from fabric.context_managers import shell_env
from fabric.api import env, local, run, sudo, settings
from generate_settings import make_postactivate_file
from os.path import join, dirname
import os

REPO_URL = 'https://github.com/Haakenlid/tassen.git'
GIT_DJANGO_PACKAGE = 'https://github.com/django/django/archive/stable/1.7.x.zip'
PYVENV = 'pyvenv-3.4'
LINUXGROUP = 'universitas'
WEBSERVER_ROOT = '/srv'


def deploy():
    """ create database, make folders, install django, create linux user, make virtualenv. """
    # Folders are named something like www.example.com
    # or www.staging.example.com for production or staging
    site_url = env.host
    folders = _get_folders(site_url)

    postactivate_file, project_settings = make_postactivate_file(site_url, )

    _create_postgres_db(project_settings)
    _create_linux_user(project_settings['user'], site_url, LINUXGROUP)

    _create_directory_structure_if_necessary(folders)
    _create_virtualenv(folders['venv'], folders['venvs'])
    _upload_postactivate(postactivate_file, folders['venv'], folders['bin'])
    _deploy_configs(site_url)
    update()


def update():
    """ update repo from github, install pip reqirements, collect staticfiles and run database migrations. """
    site_url = env.host
    folders = _get_folders(site_url)

    _get_latest_source(folders['source'])
    _update_virtualenv(folders['source'], folders['venv'],)
    _update_static_files(folders['venv'])
    _update_database(folders['venv'])
    stop()
    start()


def start():
    site_url = env.host
    _enable_site(site_url)


def stop():
    site_url = env.host
    with settings(warn_only=True):
        _enable_site(site_url, start=False)

def dropdb():
    site_url = env.host
    db_name = site_url.replace('.', '_')
    _drop_postgres_db(db_name)


def reboot():
    site_url = env.host
    _enable_site(site_url, start=False)
    sudo('service nginx restart; service supervisorctl restart')
    _enable_site(site_url)


def make_local_config():
    site_url = 'local.universitas.no'
    _deploy_configs(site_url, upload=False)


def update_config():
    site_url = env.host
    stop()
    _deploy_configs(site_url)
    start()


def _get_configs(site_url, user_name=None, bin_folder=None, config_folder=None,):
    user_name = user_name or site_url.replace('.', '_')
    bin_folder = bin_folder or '%s/%s/bin' % (WEBSERVER_ROOT, site_url)
    config_folder = config_folder or dirname(__file__)

    configs = {
        'gunicorn': {
            'template': '%s/gunicorn/template' % (config_folder,),
            'filename': '%s_gunicorn.sh' % (user_name,),
            'target folder': bin_folder,
            'install': 'sudo chmod 774 $FILENAME && sudo chown %s $FILENAME' % (user_name,),
            'start': '',
            'stop': '',
        },
        'supervisor': {
            'template': '%s/supervisor/template' % (config_folder,),
            'filename': '%s.conf' % (user_name,),
            'target folder': '/etc/supervisor/conf.d',
            'install': 'sudo supervisorctl reread && sudo supervisorctl update',
            'start': 'sudo supervisorctl start %s' % (site_url,),
            'stop': 'sudo supervisorctl stop %s' % (site_url,),
        },
        'nginx': {
            'template': '%s/nginx/template' % (config_folder,),
            'filename': '%s' % (site_url,),
            'target folder': '/etc/nginx/sites-available',
            'install': 'sudo nginx -s reload',
            'start': 'sudo ln -sf /etc/nginx/sites-available/%s /etc/nginx/sites-enabled/%s && sudo nginx -s reload' %
            (site_url, site_url,),
            'stop': 'sudo rm /etc/nginx/sites-enabled/%s && sudo nginx -s reload' % (site_url,),
        },
    }
    return configs


def _deploy_configs(site_url, user_name=None, user_group=None, upload=True):
    user_name = user_name or site_url.replace('.', '_')
    user_group = user_group or LINUXGROUP
    configs = _get_configs(site_url)
    for service in configs:
        config = configs[service]
        template = config["template"]
        target = join(dirname(template), config["filename"])
        destination = join(config["target folder"], config["filename"])
        if not os.path.exists(target) or os.path.getctime(target) < os.path.getctime(template):
            local('cat %s | sed "s/SITEURL/%s/g" | sed "s/USERNAME/%s/g" | sed "s/USERGROUP/%s/g" > "%s"' %
                  (template, site_url, user_name, user_group, target, ))
        if upload:
            put(target, destination, use_sudo=True)
            with shell_env(FILENAME=destination):
                run(config['install'])


def _enable_site(site_url, start=True):
    command = 'start' if start else 'stop'
    configs = _get_configs(site_url)
    for service in configs.values():
        run(service[command])


def _get_folders(site_url):
    venv_name = site_url
    site_folder = '%s/%s' % (WEBSERVER_ROOT, site_url,)
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
    return folders


def _upload_postactivate(postactivate_file, venv_folder, bin_folder):
    postactivate_path = '%s/postactivate' % (bin_folder,)
    activate_path = '%s/bin/activate' % (venv_folder,)
    append(activate_path, 'source %s' % (postactivate_path,))
    put(postactivate_file, postactivate_path)
    # local('rm %s' % (postactivate_file,))


def _create_directory_structure_if_necessary(folders):
    """ Ensure basic file structure in project. """
    site_folder = folders['site']
    if not exists(site_folder):
        run('mkdir -p %s' % (site_folder,))
        run('chown :%s %s' % (LINUXGROUP, site_folder))
        run('chmod 6770 %s' % (site_folder,))
    for folder in folders.values():
        run('mkdir -p %s' % (folder,))


def _create_linux_user(username, site_url, group):
    user_exists = run('id %s; echo $?' % username).split()[-1] == "0"
    if not user_exists:
        sudo('useradd --shell /bin/bash -g %s -M -c "runs gunicorn for %s" %s' % (group, site_url, username))

def _drop_postgres_db(db_name):
    # username = project_settings['user']
    # password = project_settings['db password']
    run('pg_dump -Fc dev_universitas_no > {}_$(date +"%Y-%m-%d").sql'.format(db_name,))
    run('psql -c "DROP DATABASE %s ;"' % (db_name, ))
    run('psql -c "DROP USER %s ;"' % (db_name, ))


def _create_postgres_db(project_settings):
    username = project_settings['user']
    password = project_settings['db password']
    db_name = project_settings['db name']
    databases = run(r"psql -l | grep --color=never -o '^ \w\+'").split()
    if db_name not in databases:
        print(db_name, databases)
        run('psql -c "CREATE ROLE %s NOSUPERUSER CREATEDB NOCREATEROLE LOGIN;"' % (username, ))
        run('psql -c "CREATE DATABASE %s WITH OWNER=%s  ENCODING=\'utf-8\';"' % (username, db_name, ))
    run('psql -c "ALTER ROLE %s WITH PASSWORD \'%s\';"' % (username, password, ))


def _get_latest_source(source_folder):
    """ Updates files on staging server with current git commit on dev branch. """
    if exists(source_folder + '/.git'):
        run('cd %s && git fetch' % (source_folder,))
    else:
        run('git clone %s %s' % (REPO_URL, source_folder))
    current_commit = local('git log -n 1 --format=%H', capture=True)
    run('cd %s && git reset --hard %s' % (source_folder, current_commit))


def _create_virtualenv(venv_folder, global_venv_folder):
    """ Create or update python virtual environment with the required python packages. """
    if not exists(venv_folder + '/bin/pip'):
        run('%s %s' % (PYVENV, venv_folder,))
        run('ln -fs %s %s' % (venv_folder, global_venv_folder))
        run('%s/bin/pip install %s' % (venv_folder, GIT_DJANGO_PACKAGE,))


def _update_virtualenv(source_folder, venv_folder):
    run('%s/bin/pip install -r %s/requirements.txt' %
        (venv_folder, source_folder, )
        )


def _update_static_files(venv_folder):
    """ Move images, js and css to staticfolder to be served directly by nginx. """
    run('source %s/bin/activate && django-admin collectstatic --noinput' % (venv_folder,))


def _update_database(venv_folder):
    """ Run database migrations if required by changed apps. """
    run('source %s/bin/activate && django-admin migrate --noinput' % (venv_folder,))
