""" Contributors context processor """
from .models import Stint


def get_staff():
    positions = ['redaktør', 'nyhetsleder', 'nettredaktør', 'daglig leder',
                 'annonseselger', 'webutvikler']
    active = Stint.objects.active().select_related('contributor', 'position')
    staff = []
    for position in positions:
        person = active.filter(position__title=position).first()
        if person:
            name = person.contributor.display_name
            email = person.contributor.email
            phone = person.contributor.phone
        else:
            name = '[ingen]'
            email = None
            phone = None

        staff.append(
            dict(position=position, email=email, phone=phone, name=name))
    return staff


def staff(request):
    context = {
        'office': {
            'phone': '907 69 866',
            'fax': '22 85 32 74',
            'mail': 'Boks 89 Blindern, 0314 Oslo',
            'address': 'Moltke Moes vei 33',
        },
        'staff': get_staff,
    }
    return context
