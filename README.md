universitas
===========

Testversjon av nettsiden. Setter opp Git og Virtualenv og python3 og sånn.

Dette er mest for å lære hvordan greiene funker. Satser på at det blir bra greier etterhvert.

```
/srv/universitas_project
├── config                              #config folder
│   ├── linode_universitas_nginx.config #linked nginx config
│   ├── local_universitas_nginx.config  #linked nginx config
│   ├── nginx.conf                      #linked nginx config
│   ├── README.md
│   └── supervisor_univ.conf            #linked supervisor config
├── gunicorn_start.sh                   #starts gunicorn as supervisor process
├── LICENSE
├── logs
│   ├── gunicorn_supervisor.log
│   ├── nginx-access.log
│   └── nginx-error.log
├── media                               #user uploads
├── README.md
├── run
│   └── gunicorn.sock                   #used to communicate between gunicorn and nginx
├── static                              #static uploads
└── universitas_no
    ├── articles                        #cms app for web newspaper
    │   ├── admin.py
    │   ├── __init__.py
    │   ├── models.py
    │   ├── tests.py
    │   └── views.py
    └── universitas_no                  #project settings
        ├── __init__.py
        ├── settings
        │   ├── base.py
        │   └── local.py
        ├── urls.py
        └── wsgi.py
```