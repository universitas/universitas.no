# -*- coding: utf-8 -*-
""" Contributors context processor """


def staff(request):
    context = {
        'staff': [
            {'position': 'Redaktør', 'name': 'Geir Molnes', 'email': 'g.molnes@gmail.com', },
            {'position': 'Nettredaktør', 'name': 'Petter Fløttum', 'email': 'petter.flottum@gmail.com', },
            {'position': 'Daglig leder', 'name': 'Louise Faldalen Prytz', 'email': 'l.f.prytz@universitas.no', },
            {'position': 'Redaksjonsleder', 'name': 'Vilde Sagstad Imeland', 'email': 'vildesimeland@gmail.com', },
            {'position': 'Annonseselger', 'name': 'Geir Dorp', 'email': 'geir.dorp@universitas.no', },
            {'position': 'Webutvikler', 'name': 'Håken Lid', 'email': 'haakenlid@gmail.com', },
        ]
    }
    return context
