import pytest
from rest_framework.serializers import ValidationError

from utils.serializers import PhoneNumberField, validate_phone_number

valid_numbers = ['99955999', '+4799933999', '004449440400', '092332093']
invalid_numbers = ['aaa', '99888', '++4599909922', '0395.09234']


@pytest.mark.parametrize('num', valid_numbers)
def test_valid_phone_number(num):
    validate_phone_number(num)


@pytest.mark.parametrize('num', invalid_numbers)
def test_invalid_phone_number(num):
    with pytest.raises(ValidationError):
        validate_phone_number(num)


def test_phone_number_field():
    fd = PhoneNumberField()
    with pytest.raises(ValidationError):
        fd.to_internal_value('999')

    assert fd.to_internal_value('+47 999 66 999') == '+4799966999'

    assert fd.to_internal_value('') == ''
