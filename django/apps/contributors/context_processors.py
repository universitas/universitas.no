# -*- coding: utf-8 -*-
""" Contributors context processor """


def staff(request):
    context = {
        'office': {
            'phone': '907 69 866',
            'fax': '22 85 32 74',
            'mail': 'Boks 89 Blindern, 0314 Oslo',
            'address': 'Moltke Moes vei 33',
        },
        'staff': [
            {'position': 'Redaktør', 'name': 'Torgeir Mortensen',
                'email': 'torgeirm3b@gmail.com', },
            {'position': 'Nyhetsredaktør', 'name': 'Birk Tjeldflaat Helle',
                'email': 'birktjeldflaathelle@gmail.com', },
            {'position': 'Nettredaktør', 'name': 'Sondre Moen Myhre',
                'email': 'sondre.myhre1@gmail.com', },
            {'position': 'Daglig leder', 'name': 'Joakim Stene Preston',
                'email': 'j.s.preston@universitas.no', },
            {'position': 'Annonseselger', 'name': 'Geir Dorp',
                'email': 'geir.dorp@universitas.no', },
            {'position': 'Webutvikler', 'name': 'Håken Lid',
                'email': 'haakenlid@gmail.com', },
        ]
    }
    return context
