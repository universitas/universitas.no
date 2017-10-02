"""Test API Views"""

import base64
import json
import os
import re
from datetime import timedelta

import pytest
from apps.cv.models import CVEntry, CVHost
from apps.participants.models import (
    Department, Participant, Person, Supervisor
)
from apps.schedule.models import Agendum
from apps.timeclock.models import Punch
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient


@pytest.fixture()
def patched_timezone_now(monkeypatch):
    global FAKE_TIME
    FAKE_TIME = timezone.datetime(2015, 10, 10, 8, 0, tzinfo=timezone.utc)

    def fake_now():
        return FAKE_TIME or timezone.now()

    monkeypatch.setattr('django.utils.timezone.now', fake_now)


@pytest.fixture(autouse=True)
def no_profile_image(monkeypatch):
    """Speed up tests by not generating profile images"""
    monkeypatch.setattr(Person, "placeholder_profile_image", lambda *s: None)


@pytest.fixture()
def possey(request):
    return Department.objects.create(name="Jane's possey")


@pytest.fixture()
def cvhosts(request):
    nav = CVHost.objects.create(
        name='nav', is_default=True, base_url='http://nav.no/'
    )
    linkedin = CVHost.objects.create(
        name='linkedin', is_default=True, base_url='https://no.linkedin.com'
    )
    return nav, linkedin


@pytest.fixture()
def wyatt(request):
    return get_user_model().objects.create_superuser(
        username='wyatt',
        email='wyatt@marshall.gov',
        password='gunsmoke',
    )


@pytest.fixture()
def billy(request):
    return Participant.objects.create(
        name='Bill Wilson',
        email='billyboy@dodgecity.com',
        password='hunter2',
    )


@pytest.fixture()
def willy(request):
    return Participant.objects.create(
        name='Will Wilson',
        email='will@dodgecity.com',
        password='letmein',
    )


@pytest.fixture()
def jane(request):
    return Supervisor.objects.create(
        name='Calamity Jane',
        email='calamity@dodgecity.com',
        password='deadoralive'
    )


def basic_auth(username, password):
    """Convert username & password to valid basic auth header"""
    credentials = base64.b64encode(
        bytes('{}:{}'.format(username, password), 'utf-8')
    )
    return {'HTTP_AUTHORIZATION': b'Basic ' + credentials}


@pytest.mark.django_db
def test_all_endpoints():
    """Ensure no endpoint raises exceptions"""
    jsonfile = os.path.join(
        settings.PROJECT_DIR, 'src', 'javascript', 'api-urls.json'
    )
    with open(jsonfile) as urldump:
        endpoints = json.load(urldump)
    assert endpoints != {}

    client = APIClient()
    for url_name, url_route in endpoints.items():
        reversed_url = re.sub(r'<.*?>', '1', url_route)
        response = client.get(reversed_url)
        assert response.status_code < status.HTTP_500_INTERNAL_SERVER_ERROR


@pytest.mark.django_db
def test_nested_supervisor_serializer(jane):
    """Nested API for Supervisors"""
    person_api_url = '/api/persons/'
    nested_person_api_url = '/api/persons/?nested'
    client = APIClient()
    # Jane checks in today
    todays_agendum = Agendum.objects.create_dropin(
        jane, duration=120, description="start a lynch mob"
    )

    client.login(username=jane.email, password='deadoralive')
    response = client.get(person_api_url)
    data = json.loads(response.content.decode()).get('results')[0]
    assert data['id'] == jane.id
    assert data['agendum_today'] == todays_agendum.id
    assert data['latest_agendum'] == None
    response = client.get(nested_person_api_url)
    data = json.loads(response.content.decode()).get('results')[0]
    assert data['id'] == jane.id
    assert data['agendum_today']['id'] == todays_agendum.id
    assert data['agendum_today']['description'] == todays_agendum.description


@pytest.mark.django_db
def test_nested_participant_serializer(jane, willy):
    """Nested API for Participants"""
    person_api_url = '/api/participants/'
    nested_person_api_url = '/api/participants/?nested'
    client = APIClient()
    # Jane checks in today
    todays_agendum = Agendum.objects.create_dropin(
        willy, duration=120, description="start a lynch mob"
    )

    client.login(username=jane.email, password='deadoralive')

    response = client.get(person_api_url)
    data = json.loads(response.content.decode()).get('results')[0]
    assert data['id'] == willy.id
    assert data['agendum_today'] == todays_agendum.id
    assert data['latest_agendum'] == None

    response = client.get(nested_person_api_url)
    data = json.loads(response.content.decode()).get('results')[0]
    assert data['id'] == willy.id
    assert data['agendum_today']['id'] == todays_agendum.id
    assert data['agendum_today']['description'] == todays_agendum.description


@pytest.mark.django_db
def test_participant_can_change_own_cv(billy, willy, cvhosts):
    # Billy is a new participant
    client = APIClient()
    billy.approve()
    cv_api_url = '/api/cventries/'

    # He has two cvs (Assuming it's possible to share this url)
    nav_cv = 'http://nav.no/billys-cv'
    linkedin_cv = 'https://no.linkedin.com/billys-cv'

    # Billy checks if he has any cvs registered
    response = client.get(cv_api_url)

    # He can't access the cvs since he's not logged in
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # He logs in
    client.force_authenticate(user=billy.user)

    # Billy checks if he has any cvs registered
    response = client.get(cv_api_url)

    # He can access his cvs.
    assert response.status_code == status.HTTP_200_OK
    registered_cvs = json.loads(response.content.decode()).get('results')

    # He has some empty cvs
    assert len(registered_cvs) == CVHost.objects.filter(is_default=True
                                                        ).count()
    for cv in registered_cvs:
        assert cv['url'] == ''

    # Billy posts his cvs
    response = client.post(cv_api_url, data={'owner': billy.pk, 'url': nav_cv})
    assert response.status_code == status.HTTP_201_CREATED
    response = client.post(
        cv_api_url, data={'owner': billy.pk, 'url': linkedin_cv}
    )
    assert response.status_code == status.HTTP_201_CREATED

    # He then checks that both cvs have been saved.
    cvs = json.loads(client.get(cv_api_url).content.decode())['results']
    cv_urls = set(cv['url'] for cv in cvs)

    # They are saved!
    assert linkedin_cv in cv_urls
    assert nav_cv in cv_urls

    # By mistake, Billy tries to save a cv on behalf of Willy
    # response = client.post(cv_api_url, data={'owner': willy.pk, 'url': linkedin_cv})
    # assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_participant_can_checkin(billy, patched_timezone_now):
    global FAKE_TIME
    client = APIClient()
    checkin_url = '/api/checkin/'
    # Billy has just registered
    assert billy.approval_status == Participant.NOT_YET_APPROVED
    # He has no Agenda
    assert billy.agenda.count() == 0
    # He tries to check in anyway
    response = client.post(checkin_url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    # He tries to check in with correct username and password (basic auth)
    client.credentials(**basic_auth(billy.user.username, password='hunter2'))
    response = client.post(checkin_url)

    # This also fails, because Billy has not been approved yet.
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert billy.approval_status == Participant.NOT_YET_APPROVED

    # In the meantime some supervisor approves Billy's account.
    billy.approve()
    assert billy.approval_status == Participant.APPROVED

    # Billy is told to check in again
    response = client.post(checkin_url, data={'description': 'Punch all day.'})
    # This time it works
    assert response.status_code == status.HTTP_201_CREATED

    # Billy is informed that an agendum has been created.
    agendum_today = json.loads(response.content.decode())
    assert billy.agenda.count() == 1
    assert agendum_today['id'] == billy.get_agendum_today().id
    assert agendum_today['description'] == 'Punch all day.'
    assert agendum_today['status'] == Agendum.CHECKED_IN

    # There is only one punch
    assert len(agendum_today['punches']) == 1
    punch = agendum_today['punches'][0]
    assert punch['event'] == Punch.IN

    # Billy decides to punch in and out a few times
    for n in range(4):
        FAKE_TIME += timedelta(minutes=1)
        response = client.post(checkin_url)
        assert response.status_code == status.HTTP_201_CREATED

    # He still has only one Agendum, but that agendum has 6 punches
    assert billy.agenda.count() == 1
    assert billy.get_agendum_today().punches.count() == 5
    # He then tries to punch in more rapidly
    for n in range(4):
        FAKE_TIME += timedelta(seconds=5)
        failed_response = client.post(checkin_url)
        # This fails, because the api will not allow too fast punching
        assert failed_response.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    # There is still just 5 punches saved.
    assert billy.get_agendum_today().punches.count() == 5

    work_all_day = json.loads(response.content.decode())
    assert work_all_day['status'] == Agendum.CHECKED_IN
    # Description is still the same
    assert work_all_day['description'] == 'Punch all day.'

    # He has punched in and out 3 times.
    assert all(p['event'] == Punch.IN for p in work_all_day['punches'][::2])
    assert all(p['event'] == Punch.OUT for p in work_all_day['punches'][1::2])

    # Billy is tired. He decides to call it a day.
    # But before leaving, he decides to update the Agendum description
    FAKE_TIME = FAKE_TIME.replace(hour=16, minute=0, second=0)
    # He checks out at four o clock
    client.post(checkin_url)

    # Then he remembers to change the description
    update_url = '/api/checkin/{billy.pk}/'.format(billy=billy)
    response = client.patch(update_url, data={'description': 'BEST DAY EVER!'})
    best_day_ever = json.loads(response.content.decode())

    # Status is still the same
    assert best_day_ever['status'] == Agendum.CHECKED_OUT
    assert len(best_day_ever['punches']) == 6

    # Description has been updated
    assert best_day_ever['description'] == 'BEST DAY EVER!'

    eight_hours = 8 * 60 * 60
    two_minutes = 2 * 60

    # The registered duration is also correct
    assert best_day_ever['registered_duration'] == eight_hours - two_minutes

    # Billy gets an agenda for the next day as well
    tomorrow = (timezone.now() + timedelta(days=1))
    next_morning = Agendum.objects.create(
        owner=billy,
        start_time=tomorrow.replace(hour=8, minute=0),
        end_time=tomorrow.replace(hour=14, minute=0),
        description='Hung over',
    )
    assert next_morning.duration == (14 - 8) * 60 * 60
    assert next_morning.start_time.strftime('%H:%M') == '08:00'

    # Billy shows up five minutes early
    FAKE_TIME = next_morning.start_time - timedelta(minutes=5)
    assert timezone.now().strftime('%H:%M') == '07:55'

    # Billy checks his agenda
    response = client.get(checkin_url)
    next_days_agenda = json.loads(response.content.decode())
    assert next_days_agenda['description'] == 'Hung over'
    assert next_days_agenda['status_text'] == 'framtid'

    # Billy waits 10 minutes before checking in
    FAKE_TIME += timedelta(minutes=10)
    response = client.post(checkin_url, data={'description': 'Slack off'})
    next_days_agenda = json.loads(response.content.decode())
    assert next_days_agenda['description'] == 'Slack off'
    assert next_days_agenda['status_text'] == 'stemplet inn'

    assert next_days_agenda['id'] != best_day_ever['id']


@pytest.mark.django_db
def test_participant_api_access(billy, willy, monkeypatch):
    # monkeypatch.setattr(Person, 'placeholder_profile_image', placeholder)
    # monkeypatch.setattr(Person, 'get_avatar', placeholder)

    ##### CHAPTER ONE #####
    # Will and Bill Wilson are new in town
    willy.approve()
    billy.approve()

    client = APIClient()
    # Will tries to log into the application, but can't remember the password.
    # The login fails.
    assert client.login(
        username=willy.user.username, password='iforgot!!'
    ) is False

    # Even though Billy's not logged in, he tries to access the api.
    response = client.get('/api/', format='json')
    # He can access the root url alright.
    assert response.status_code == status.HTTP_200_OK

    # Then he tries to see if he can access the participants endpoint.
    response = client.get('/api/participants/', format='json')
    # Since he's not logged in, he is denied access.
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert 'results' not in response.content.decode()

    # Then will remembers the password, and logs in successfully
    assert client.login(
        username='will@dodgecity.com', password='letmein'
    ) is True
    # He tries to access the api again
    response = client.get('/api/participants/', format='json')
    # Everything is OK!!!
    assert response.status_code == status.HTTP_200_OK
    assert 'Allow: GET, POST, HEAD, OPTIONS' in response.serialize_headers(
    ).decode()

    # In the data returned from the api there is only one participant
    content = json.loads(response.content.decode())
    assert content['count'] == 1
    # That person is Willy himself.
    assert content['results'][0]['name'] == 'Will Wilson'
    assert content['results'][0]['email'] == 'will@dodgecity.com'
    assert content['results'][0]['id'] == willy.id
    # Actually, there are two partcicipants registered.
    assert Participant.objects.count() == 2


@pytest.mark.django_db
def test_supervisor_api_access(jane, billy, willy, possey):
    ##### CHAPTER TWO #####
    client = APIClient()
    # There is a new Supervisor in town – with the name of Jane.
    # Jane logs into the website, using her password and email.
    client.login(username=jane.email, password='deadoralive')
    # She accesses the api to view the participants
    content = json.loads(
        client.get('/api/participants/', format='json').content.decode()
    )
    # There are two participants visible
    assert content['count'] == 2
    # That's Willy and Billy!
    res = content['results']
    assert {entry['name'] for entry in res} == {'Will Wilson', 'Bill Wilson'}
    assert {entry['id'] for entry in res} == {willy.id, billy.id}
    # Using python's set literal {} instead of list for comparing equality,
    # because the order of entries in the collection is irrelevant.

    # Jane is not listed as a Participant
    assert jane.name not in {entry['name'] for entry in res}

    # Jane wants to learn more about Billy.
    billys_url = '/api/participants/%d/' % billy.pk
    response = client.get(billys_url, format='json')
    data = json.loads(response.content.decode())
    assert response.status_code == status.HTTP_200_OK

    # She sees that Billy has no assigned supervisor.
    assert data['supervisor'] is None

    # And the api can be used to change Billy.
    assert 'Allow: GET, PUT, PATCH, DELETE' in response.serialize_headers(
    ).decode()

    # Jane decides to make a better Billy
    better_billy = {
        'name': 'deputy ' + billy.name,
        'department': possey.pk,
        'supervisor': jane.pk,
    }
    # Jane updates Billy by sending a PATCH to the api.
    response = client.patch(billys_url, format='json', data=better_billy)
    response_data = json.loads(response.content.decode())

    # Billy is now a member of Jane's possey
    assert response.status_code == status.HTTP_200_OK
    assert better_billy['name'] == response_data['name']
    assert better_billy['department'] == response_data['department']
    assert better_billy['supervisor'] == response_data['supervisor']


@pytest.mark.django_db
def supervisor_can_assign_schedule_to_participant(billy, jane, possey):
    # Jane wonders if Billy has any plans.
    client = APIClient()
    client.login(username=jane.email, password='deadoralive')
    billys_url = '/api/participants/%d/' % billy.pk
    response_data = client.get(billys_url).json
    agenda_url = response_data['agenda']
    billys_agenda = client.get(agenda_url, format='json')

    # She successfully accesses Billy's agenda and can see that
    # his appointment book is empty.
    assert billys_agenda.status_code == status.HTTP_200_OK
    assert json.loads(billys_agenda.content)['count'] == 0

    # Jane decides to give Billy something to do.
    schedule_days = []
    mischief = [
        'Gamble', 'Drink and smoke', 'Lie and cheat', 'Rustle cattle',
        'Spit on the sidewalk', 'Rob the bank', 'Murder'
    ]
    morning, night = '06:00', '23:00'
    for day, crime in enumerate(mischief):
        schedule_days.append({
            'weekday': day,
            'start_time': morning,
            'end_time': night,
            'description': crime,
        })
    billys_schedule = {'days': schedule_days}

    # She finds Billy's schedule api.
    schedule_url = '/api/weeklyschedules/{}/'.format(
        response_data['assigned_weekly_schedule']
    )

    response = client.get(schedule_url, format='json')

    # Jane confirms that Billy is currently unemployed.
    assert json.loads(response.content.decode())['days'] == []

    # Jane updates Billy's schedule, so he doesn't have to be idle all the
    # time.
    response = client.patch(schedule_url, data=billys_schedule, format='json')
    assert response.status_code == status.HTTP_200_OK
    updated_schedule = json.loads(response.content.decode())
    assert len(updated_schedule['days']) == 7
    assert updated_schedule['summary'] == u'Man–Søn: 6–23'
