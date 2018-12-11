""" Tests for exif library """

import pytest

from apps.photo.exif import (
    clean_exif_data,
    get_metadata,
    parse_exif_timestamp,
    sanitize_image_exif,
    serialize_exif,
)
from apps.photo.file_operations import pil_image


def test_serialize_exif(jpeg_file):
    image = pil_image(jpeg_file)
    data = serialize_exif(image)
    assert data.get('Artist') == 'Dennis the Dog'
    meta = get_metadata(data)
    assert meta.created.timetuple()[:6] == (1999, 9, 9, 22, 22, 22)
    assert meta.artist == 'Dennis the Dog'


def test_exif_strptime():
    dt = parse_exif_timestamp('1999:09:09 22:22:22')

    # valid timestamp -> datetime with local timezone
    assert dt.timetuple()[:6] == (1999, 9, 9, 22, 22, 22)
    assert dt.tzinfo is not None  # local

    with pytest.raises(ValueError):
        parse_exif_timestamp('1999:50:09 22:22:22')


def test_clean_data():
    """ Turn data into plain json-serializable types """

    # unchanged types
    assert clean_exif_data(1) == 1
    assert clean_exif_data(1.5e5) == 1.5e5
    assert clean_exif_data({}) == {}
    assert clean_exif_data([]) == []

    # tuples -> list
    assert clean_exif_data((1, 2, 3)) == [1, 2, 3]

    # set -> list
    assert sorted(clean_exif_data({1, 2, 3})) == [1, 2, 3]

    # bytes -> str
    assert clean_exif_data(b'foobar') == 'foobar'

    # non-ascii bytes are base64-encoded
    assert clean_exif_data(b'\x00\x01') == 'BASE64|AAE='

    # other types -> repr(value)
    assert clean_exif_data(5j) == '5j'

    # nested data structures
    source = ({1: 2, False: b'False', 'bytes': (b'bytes', )}, [({1j}, )])
    result = [{'1': 2, 'False': 'False', 'bytes': ['bytes']}, [[['1j']]]]
    assert clean_exif_data(source) == result

    # ascii strings
    assert clean_exif_data('foobar') == 'foobar'

    # strings with nulls
    assert clean_exif_data('foo\x00bar') == 'foobar'

    # mojibake strings
    name = 'Stépân'  # string with non-ascii characters
    assert clean_exif_data(name) == name
    assert clean_exif_data(name.encode('utf8').decode('latin1')) == name
