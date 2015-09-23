# -*- coding: utf-8 -*-
""" Contributors context processor """


def staff(request):
    context = {
        'staff': [
            {'position': 'Redaktør', 'name': 'Magnus Newth', 'email': 'mgnewth@universitas.no', },
            {'position': 'Nettredaktør', 'name': 'Magnus Braaten', 'email': 'magnus.braaten@gmail.com', },
            {'position': 'Daglig leder', 'name': 'Louise Faldalen Prytz', 'email': 'l.f.prytz@universitas.no', },
            {'position': 'Redaksjonsleder', 'name': 'Julie Kalager', 'email': 'julika@universitas.no', },
            {'position': 'Annonseselger', 'name': 'Geir Dorp', 'email': 'geir.dorp@universitas.no', },
            {'position': 'Webutvikler', 'name': 'Håken Lid', 'email': 'haakenlid@gmail.com', },
        ]
    }
    return context
