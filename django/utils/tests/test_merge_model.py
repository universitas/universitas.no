import pytest

from apps.contributors.models import Contributor
from utils.auth import get_instance
from utils.merge_model_objects import merge_instances


@pytest.fixture
def jimmy(request):
    return Contributor.objects.create(
        display_name='Jimmy Foobarson', email='foo@example.com'
    )


@pytest.fixture
def jimmy_twin(request):
    return Contributor.objects.create(
        display_name='Jimmy Foobarson II', email='foo@example.com'
    )


@pytest.mark.django_db
def test_contributor_exists(jimmy, jimmy_twin):
    assert str(jimmy) == 'Jimmy Foobarson'
    assert Contributor.objects.count() == 2
    merge_instances(jimmy, jimmy_twin)
    assert Contributor.objects.count() == 1


@pytest.mark.django_db
def test_get_instance(jimmy, jimmy_twin):
    # works when there's one instance
    assert get_instance(
        Contributor,
        {'display_name': jimmy.display_name, 'email': jimmy.email}
    ) == jimmy
    # works when there's two instances
    assert get_instance(Contributor, {'email': jimmy.email}) == jimmy_twin
    # works when there's no instance
    assert get_instance(Contributor,
                        {'email': 'doesnexits@example.com'}) is None
