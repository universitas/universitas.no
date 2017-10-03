""" Tests for exif library """

from apps.photo.exif import (
    ExifData, clean_data, exif_to_json, extract_exif_data, parse_exif_timestamp
)


def test_exif_to_json(jpeg_file):
    data = exif_to_json(jpeg_file)
    assert data.get('Artist') == 'Dennis the Dog'
    exif = extract_exif_data(data)
    assert isinstance(exif, ExifData)
    assert exif.artist == 'Dennis the Dog'
    assert exif.datetime.timetuple()[:6] == (1999, 9, 9, 22, 22, 22)


def test_exif_strptime():
    dt = parse_exif_timestamp('1999:09:09 22:22:22')

    # valid timestamp -> datetime with local timezone
    assert dt.timetuple()[:6] == (1999, 9, 9, 22, 22, 22)
    assert dt.tzinfo is not None  # local

    # invalid timestamp -> None
    assert parse_exif_timestamp('1999:50:09 22:22:22') is None


def test_clean_data():
    """ Turn data into plain json-serializable types """

    # unchanged types
    assert clean_data(1) == 1
    assert clean_data(1.5e5) == 1.5e5
    assert clean_data({}) == {}
    assert clean_data([]) == []

    # tuples -> list
    assert clean_data((1, 2, 3)) == [1, 2, 3]

    # set -> list
    assert sorted(clean_data({1, 2, 3})) == [1, 2, 3]

    # bytes -> str
    assert clean_data(b'foobar') == 'foobar'

    # non-ascii bytes are base64-encoded
    assert clean_data(b'\x00\x01') == 'BASE64|AAE='

    # other types -> repr(value)
    assert clean_data(5j) == '5j'

    # nested data structures
    source = ({1: 2, False: b'False', 'bytes': (b'bytes', )}, [({1j}, )])
    result = [{'1': 2, 'False': 'False', 'bytes': ['bytes']}, [[['1j']]]]
    assert clean_data(source) == result

    # ascii strings
    assert clean_data('foobar') == 'foobar'

    # strings with nulls
    assert clean_data('foo\x00bar') == 'foobar'

    # mojibake strings
    name = 'Stépân'  # string with non-ascii characters
    assert clean_data(name) == name
    assert clean_data(name.encode('utf8').decode('latin1')) == name
