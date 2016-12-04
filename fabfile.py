""" Deployment of Django website using pyvenv-3.4 and git """

import os
# import re
from os.path import join, dirname
from fabric.contrib.files import append, exists, put
from fabric.context_managers import shell_env, cd
from fabric.api import local, env, run, sudo, settings, task
from fabric.utils import abort
from deployment_tools.generate_postactivate import make_postactivate_file

# github repo used for deploying the site
REPO_URL = 'git@github.com:universitas/tassen.git'

PYVENV = 'python3 -m venv'  # using python 3 for virtual environments
LINUXGROUP = 'universitas'  # linux user group on the webserver
WEBSERVER_ROOT = '/srv'  # root folder for all websites on the webserver
SITE_NAME = 'universitas.no'
env.site_url = 'vagrant.' + SITE_NAME


@task(name='local')
def localhost():
    """ run task on localhost """
    env.site_url = 'local.' + SITE_NAME
    env.hosts = [env.site_url]


@task(name='prod')
def production_server():
    """ run task on development server """
    env.site_url = 'www.' + SITE_NAME
    env.hosts = [env.site_url]


@task(name='staging')
def staging_server():
    """ run task on development server """
    env.site_url = 'staging.' + SITE_NAME
    env.hosts = [env.site_url]


@task(name='dev')
def development_server():
    """ run task on development server """
    env.site_url = 'dev.' + SITE_NAME
    env.hosts = [env.site_url]


@task(name='notebook')
def start_ipython_notebook():
    """ start the ipython notebook """
    django_admin('shell_plus', '--notebook', '--no-browser')


@task(name='runserver')
def start_runserver_plus():
    """ Start a development webserver """
    folders = _get_folders(env.site_url)
    with cd(folders['venv']):
        run('source bin/activate && django-admin runserver_plus')


@task(name='admin')
def django_admin(*args):
    """ run arbitrary django-admin commands """
    venv_folder = _get_folders(env.site_url)['venv']
    run('source {venv}/bin/activate && django-admin {args}'.format(
        venv=venv_folder,
        args=' '.join(args), ))


def _get_folders(site_url=None):
    """ Return a dictionary containing pathnames of named project folders. """
    site_url = site_url or env.site_url
    folders = {
        'site': '{site_folder}',                   # project root folder
        'django': '{site_folder}/django',          # django source code
        'bin': '{site_folder}/bin',                # bash scripts
        # static files served by nginx
        'static': '{site_folder}/static',
        'media': '{site_folder}/static/media',     # user uploaded files
        'venv': '{site_folder}/pyvenv/{venv_name}',  # virtual environment
        'logs': '{site_folder}/logs',              # contains logfiles
        # global folder with symlinks to all virtual environments
        'venvs': '/home/{user}/.virtualenvs',
    }

    site_folder = '{root}/{url}'.format(
        root=WEBSERVER_ROOT,
        url=site_url,
    )

    for folder in folders:
        folders[folder] = folders[folder].format(
            venv_name=site_url,
            user=env.user,
            site_folder=site_folder,
        )

    return folders


def _get_configs(
        site_url=None, user_name=None, bin_folder=None, config_folder=None):
    """
    Return a dictionary containing configuration for webserver services.
    """
    # user name for database and linux
    site_url = site_url or env.site_url
    user_name = user_name or site_url.replace('.', '_')
    # folder to put shell scripts
    project_folder = '{root}/{url}/'.format(
        root=WEBSERVER_ROOT,
        url=site_url)
    bin_folder = bin_folder or project_folder + 'bin'
    # parent folder of config file templates.
    config_folder = config_folder or dirname(__file__) + '/deployment_tools'

    configs = {
        # 'service': { # name of program or service that need configuration
        # 'template': # template for configuration file
        # 'filename': # what to call the config file made from template
        # 'target folder': # where to put the config file
        # 'install': # bash command to prepare and activate the config file.
        # 'start': # bash command to start the service
        # 'stop': # bash command to stop the service
        # },
        'site': {  # python wsgi runner for django
            'template': '{c}/site/template'.format(c=config_folder),
            'filename': '{u}.sh'.format(u=user_name),
            'target folder': bin_folder,
            # make bash file executable by the supervisor user.
            'install': ('sudo chmod 774 $FILENAME &&'
                        'sudo chown {u} $FILENAME').format(u=user_name),
            'start': ':',
            'stop': ':',
        },
        'supervisor': {  # keeps gunicorn running
            'template': '{c}/supervisor/template'.format(c=config_folder,),
            'filename': '{u}.conf'.format(u=user_name,),
            'target folder': '/etc/supervisor/conf.d',
            # read all config files in conf.d folder
            'install': 'sudo supervisorctl reread && sudo supervisorctl update',
            'start': 'sudo supervisorctl start {url}:*'.format(url=site_url),
            'stop': 'sudo supervisorctl stop {url}:*'.format(url=site_url),
        },
        'nginx': {  # webserver
            'template': '{c}/nginx/template'.format(c=config_folder,),
            'filename': '{url}'.format(url=site_url,),
            'target folder': '/etc/nginx/sites-available',
            'install': ':',
            'start': (
                # create symbolic link from config file to sites-enabled
                'sudo ln -sf '
                '/etc/nginx/sites-available/{url} '
                '/etc/nginx/sites-enabled/{url} '
                # reload nginx service
                '&& sudo nginx -s reload').format(url=site_url),
            # remove symbolic link
            'stop': ('sudo rm -f /etc/nginx/sites-enabled/{url} && '
                     'sudo nginx -s reload').format(url=site_url,),
        },
    }
    return configs


@task
def fix_permissions():
    folders = _get_folders()
    _folders_and_permissions(folders)


@task
def make_postactivate():
    """ create postactivate file """
    postactivate_file, project_settings = make_postactivate_file(
        env.site_url, )
    return postactivate_file


@task
def deploy():
    """Create database, make folders, install django,
    create linux user, make virtualenv. """
    # Folders are named something like www.example.com
    # or www.staging.example.com for production or staging
    folders = _get_folders()
    postactivate_file, project_settings = make_postactivate_file(
        env.site_url, )
    _create_postgres_db(project_settings)
    _create_linux_user(project_settings['user'], LINUXGROUP)
    _folders_and_permissions(folders)
    _get_latest_source(folders)
    _create_virtualenv(folders)
    _upload_postactivate(postactivate_file, folders['venv'], folders['bin'])
    _deploy_configs()
    update()


@task
def update():
    """
    Update repo from github, install pip reqirements,
    collect staticfiles and run database migrations.
    """
    folders = _get_folders()
    _get_latest_source(folders)
    _pip_install(folders)
    stop()
    _database_migrations()
    _npm_install(folders)
    _npm_build(folders)
    _collect_static()
    start()


@task
def start():
    """ Start webserver for site """
    _enable_site()


@task
def stop():
    """ Stop webserver from serving site """
    with settings(warn_only=True):
        _enable_site(start=False)


@task
def dropdb():
    """ Delete the site database """
    db_name = env.site_url.replace('.', '_')
    _drop_postgres_db(db_name)


@task
def reboot():
    """ Restart all services connected to website """
    _enable_site(start=False)
    sudo('service nginx restart; service supervisor restart')
    _enable_site()


@task
def make_configs():
    """ Create configuration files, but do not upload """
    _deploy_configs(upload=False)


@task
def update_config():
    """ Update the configuration files for services and restart site. """
    stop()
    _deploy_configs()
    start()


def _deploy_configs(user_name=None, user_group=None, upload=True):
    """
    Creates new configs for webserver and services and uploads them to webserver.
    If a custom version of config exists locally that is newer than the template config,
    a new config file will not be created from template.
    """
    site_url = env.site_url
    user_name = user_name or site_url.replace('.', '_')
    user_group = user_group or LINUXGROUP
    configs = _get_configs(site_url)
    for service in configs:  # services are webserver, wsgi service and so on.
        config = configs[service]
        template = config['template']  # template config file
        target = join(
            dirname(template),
            config['filename'])  # name for parsed config file
        # server filepath to place config file. Outside git repo.
        destination = join(config['target folder'], config['filename'])
        if not os.path.exists(target) or os.path.getctime(
                target) < os.path.getctime(template):
            # Generate config file from template if a newer custom file does not exist.
            # use sed to change variable names that will differ between
            # deployments and sites.
            local((
                'cat "{template}" | '
                'sed "s/SITEURL/{url}/g" | '
                'sed "s/USERNAME/{user}/g" | '
                'sed "s/USERGROUP/{group}/g" > '
                '"{filename}"'
            ).format(
                template=template,
                url=site_url,
                user=user_name,
                group=user_group,
                filename=target,
            ))
        if upload:
            # upload config file
            put(target, destination, use_sudo=True)
            with shell_env(FILENAME=destination):
                # run command to make service register new config and restart if
                # needed.
                run(config['install'])


def _enable_site(start=True):
    """
    Start webserver and enable configuration and services to serve the site.
    if start=False, stops the wsgi-server and deactivates nginx config for the site.
    """
    command = 'start' if start else 'stop'
    configs = _get_configs()
    for service in configs.values():
        run(service[command])


def _upload_postactivate(postactivate_file, venv_folder, bin_folder):
    """ Uploads postactivate shell script file to server. """
    # full filepath for the uploaded file.
    postactivate_path = '{bin}/postactivate'.format(bin=bin_folder,)
    # full filepath for python virtual environment activation shellscript on
    # the server.
    activate_path = '{venv}/bin/activate'.format(venv=venv_folder,)
    # add bash command to activate shellscript to source (run) postactivate
    # script when the virtualenvironment is activated.
    append(
        activate_path,
        'source {postactivate}'.format(
            postactivate=postactivate_path,
        ))
    # upload file.
    put(postactivate_file, postactivate_path)


def _folders_and_permissions(folders):
    """ Ensure basic file structure in project. """
    site_folder = folders['site']

    # sudo('find {site_folder} -type d -exec chmod 6775 "{{}}" \;'.format(
    #     site_folder=site_folder))
    # set linux user group.
    sudo('mkdir -p {site_folder} &&'
         'chown -R :{group} {site_folder}'.format(
             group=LINUXGROUP,
             site_folder=site_folder))


def _create_linux_user(username, group):
    """ Create a new linux user to run programs and own project files and
    folders on the webserver. """
    # Bash command id user returns error code 1 if user does not
    # exist and code 0 if user exists.
    # To avoid Fabric raising an exception on an expected shell error,
    # return code ($?) is echoded to stdout and passed to python as a string.
    user_exists = run(
        'id {linux_user}; echo $?'.format(
            linux_user=username,
        ))
    user_exists = user_exists.split()[-1] == '0'
    if not user_exists:
        # Create new group if it doesn't exist
        sudo(
            (
                'groupadd --force {linux_group}'
            ).format(
                linux_group=group,
            )
        )
        # Create user and add to the default group.
        sudo(
            (
                'useradd --shell /bin/bash '
                '-g {linux_group} -M -c '
                '"runs gunicorn for {site_url}" {linux_user}'
            ).format(
                linux_group=group,
                site_url=env.site_url,
                linux_user=username
            )
        )


def _drop_postgres_db(db_name, backup=True):
    """Delete database and user.
    Dumps the database to file before deleting"""
    if backup:
        run('pg_dump -Fc {db_name} > {db_name}_$(date +"%Y-%m-%d").sql'.format(
            db_name=db_name,))
    run('psql -c "DROP DATABASE {db_name}"'.format(db_name=db_name,))
    run('psql -c "DROP USER {db_user}"'.format(db_user=db_name,))


def _create_postgres_db(project_settings):
    """Create postgres database and user for the django deployment.
    Will also change that user's postgres password."""
    username = project_settings['user']
    password = project_settings['db_password']
    db_name = project_settings['db_name']
    databases = run(r'psql -l | grep --color=never -o "^ \w\+"').split()
    if db_name not in databases:
        print(db_name, databases)
        # create user
        run('psql -c "CREATE ROLE {user} NOSUPERUSER CREATEDB NOCREATEROLE LOGIN"'.format(
            user=username, ))
        # create database
        run('psql -c "CREATE DATABASE {db} WITH OWNER={user}  ENCODING=\'utf-8\';"'.format(
            user=username, db=db_name, ))
    # change password. This will happen even if user already exists.
    # this is because a new password is created every time the postactivate
    # file has to be changed.
    run(
        'psql -c "ALTER ROLE {user} WITH PASSWORD \'{password}\';"'.format(
            user=username,
            password=password,
        ))


def _get_latest_source(folders):
    """ Updates files on staging server with current git commit on dev branch. """
    current_commit = local('git log -n 1 --format=%H', capture=True)
    git_status = local('git status', capture=True)
    site_folder = folders['site']

    if not exists(site_folder + '/.git'):
        run('git clone {} {}'.format(REPO_URL, site_folder))

    if 'branch is ahead' not in git_status and 'nothing to commit' in git_status:
        with cd(site_folder):
            run('git fetch && git reset --hard {}'.format(current_commit))
    elif 'vagrant' not in env.site_url and 'local' not in env.site_url:
        abort('Local source code changes has not been pushed to repo.')


def _create_virtualenv(folders):
    """ Create python virtual environment. """
    # This file will exist if the virtual env is already created.
    venv_python_bin = os.path.join(folders['venv'], 'bin', 'python')

    if not exists(venv_python_bin):
        commands = [
            '{virtualenv_binary} {venv}',  # create venv
            'ln -fs {venv} {venvs}',  # symlink to $WORKON_HOME folder
            'echo {django} > {venv}/.project',  # create .project file
        ]
        kwargs = folders.copy()
        kwargs['virtualenv_binary'] = PYVENV

        for command in commands:
            run(command.format(**kwargs))


def _pip_install(folders):
    """ Install required python packages from pip requirements file. """
    run('{venv}/bin/pip install -vr {site}/requirements.txt'.format(**folders))


def _npm_install(folders):
    """ Install npm dependencies """
    with cd(folders['site']):
        run('npm install')


def _npm_build(folders):
    """ Build with webpack """
    with cd(folders['site']):
        run('npm run build')


def _collect_static():
    """Move images, js and css to staticfolder or CDN."""
    django_admin('collectstatic', '--noinput')


def _database_migrations():
    """ Run database migrations if required by changed apps. """
    django_admin('migrate', '--noinput')


def _fix_permissions(folder):
    """ Fix folder permissions """
    sudo('')


def run_bg(cmd, before=None, sockname="dtach", use_sudo=False):
    """Run a command in the background using dtach

    :param cmd: The command to run
    :param output_file: The file to send all of the output to.
    :param before: The command to run before the dtach. E.g. exporting
                   environment variable
    :param sockname: The socket name to use for the temp file
    :param use_sudo: Whether or not to use sudo
    """
    if not exists("/usr/bin/dtach"):
        sudo("apt-get install dtach")
    if before:
        cmd = "{}; dtach -n `mktemp -u /tmp/{}.XXXX` {}".format(
            before, sockname, cmd)
    else:
        cmd = "dtach -n `mktemp -u /tmp/{}.XXXX` {}".format(sockname, cmd)
    if use_sudo:
        return sudo(cmd)
    else:
        return run(cmd)
