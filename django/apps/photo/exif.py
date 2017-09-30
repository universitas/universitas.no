""" Make image file data serializable """
import base64
import datetime
import logging
import string
from collections import namedtuple

from PIL import ExifTags, Image

from django.utils import timezone

logger = logging.getLogger(__name__)

ExifData = namedtuple('ExifData', 'description, datetime, artist, copyright')


def clean_data(value):
    """Make data json-serializable"""
    if isinstance(value, (tuple, list)):
        return [clean_data(v) for v in value]
    if isinstance(value, dict):
        return {str(k): clean_data(v) for k, v in value.items()}
    if isinstance(value, bytes):
        try:
            text = value.decode('ascii')
            if set(text).issubset(set(string.printable)):
                return text
        except UnicodeError:
            pass
        return 'BASE64|' + base64.b64encode(value).decode()
    if isinstance(value, str):
        # exif text is incorrectly decoded
        return value.encode('latin1').decode('utf8').replace('\x00', '')

    return repr(value)


def exif_to_json(fp):
    """Get exif dictionary from open file pointer"""
    try:
        fp.open()
    except:
        logger.exception('could not open file %s' % fp)
    else:
        tags = Image.open(fp)._getexif()
        if not tags:
            return {}
        data = {ExifTags.TAGS.get(k, k): v for k, v in tags.items()}
    finally:
        fp.close()
    return clean_data(data)


def extract_exif_data(data):
    date = data.get('DateTimeOriginal') or data.get('DateTime', '')
    return ExifData(
        datetime=parse_exif_timestamp(date),
        description=data.get('ImageDescription', ''),
        copyright=data.get('Copyright', ''),
        artist=data.get('Artist', ''),
    )


def parse_exif_timestamp(timestamp):
    """Exif timestamp of format"""
    try:
        dt = timezone.datetime.strptime(timestamp, '%Y:%m:%d %H:%M:%S')
    except ValueError:
        return None
    return timezone.make_aware(dt, timezone.get_default_timezone())
