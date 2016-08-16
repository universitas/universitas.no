# -*- coding: utf-8 -*-
""" Contributors context processor """


def staff(request):
    context = {
        'staff': [
            {'position': 'Ansvarlig Redaktør', 'name': 'Torgeir Mortensen', 'email': 'torgeirm3b@gmail.com', },
            {'position': 'Nyhetsredaktør', 'name': 'Birk Tjeldflaat Helle', 'email': 'birktjeldflaathelle@gmail.com', },
            {'position': 'Nettredaktør', 'name': 'Sondre Myhre', 'email': 'sondre.myhre1@gmail.com', },
            {'position': 'Daglig leder', 'name': 'Louise Faldalen Prytz', 'email': 'l.f.prytz@universitas.no', },
            {'position': 'Annonseselger', 'name': 'Geir Dorp', 'email': 'geir.dorp@universitas.no', },
            {'position': 'Webutvikler', 'name': 'Håken Lid', 'email': 'haakenlid@gmail.com', },
        ]
    }
    return context
