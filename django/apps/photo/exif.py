""" Make image file data serializable """
import base64
import logging
import string
from collections import namedtuple
from datetime import datetime
from typing import Any, Optional

import ftfy
import PIL.ExifTags

from django.utils import timezone

from .file_operations import get_exif

logger = logging.getLogger(__name__)

ExifData = namedtuple('ExifData', 'description, datetime, artist, copyright')


def clean_data(value: Any) -> Any:
    """Make data json-serializable"""
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, (tuple, list, set)):
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
        return ftfy.fix_text(value)

    return repr(value)


def exif_to_json(imgdata: bytes) -> dict:
    """Get exif dictionary from open file pointer"""
    tags = get_exif(imgdata)

    return clean_data({
        PIL.ExifTags.TAGS.get(k, str(k)): v
        for k, v in tags.items()
    })


def extract_exif_data(data: dict) -> ExifData:
    original_date = data.get('DateTimeOriginal') or data.get('DateTime', '')
    return ExifData(
        datetime=parse_exif_timestamp(original_date),
        description=data.get('ImageDescription', ''),
        copyright=data.get('Copyright', ''),
        artist=data.get('Artist', ''),
    )


def parse_exif_timestamp(timestamp: str) -> Optional[datetime]:
    """Exif timestamp of format"""
    try:
        dt = timezone.datetime.strptime(timestamp, '%Y:%m:%d %H:%M:%S')
    except ValueError:
        return None
    return timezone.make_aware(dt, timezone.get_default_timezone())
