""" Make image file data serializable """
import base64
import logging
import string
from collections import namedtuple
from datetime import datetime
from typing import Any, Union

import PIL.ExifTags
from PIL.Image import Image

import ftfy
import piexif
from django.utils import timezone

logger = logging.getLogger(__name__)


def sanitize_image_exif(img: Image) -> bytes:
    """Prune thumbnail and other excessive exif data from image file."""
    exif_bytes = img.info.get('exif')
    if not exif_bytes:
        return b''
    exif_dict = piexif.load(exif_bytes)
    pruned_dict = prune_exif(exif_dict)
    return piexif.dump(pruned_dict)


def serialize_exif(img: Image) -> dict:
    """Get exif dictionary from pil image   """
    tags = img._getexif() or {}
    return clean_exif_data({
        PIL.ExifTags.TAGS.get(k, str(k)): v
        for k, v in tags.items()
    })


def prune_exif(exif_dict: dict, maxbytes=1000) -> dict:
    """Remove non-standard and bloated exif data."""
    # remove thumbnail binary data to save space
    del exif_dict['thumbnail']
    # remove gps data?
    # del exif_dict['gps']
    # unset image rotation
    exif_dict['0th'][piexif.ImageIFD.Orientation] = 1
    # loop over main exif data
    for key in sorted(exif_dict, reverse=True):
        subsection = exif_dict[key]
        for subkey, value in list(subsection.items()):
            try:
                if len(value) > maxbytes:
                    del subsection[subkey]
            except TypeError:
                pass
        for subkey in sorted(subsection, reverse=True):
            try:
                data = {"Exif": {}, **{key: subsection}}
                piexif.dump(data)
                # subsection seems valid
                break
            except ValueError:
                del subsection[subkey]
        else:
            # entire subsection is broken
            del exif_dict[key]
    return exif_dict


def clean_exif_data(value: Any) -> Any:
    """Make exif data dict serializable"""
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, (tuple, list, set)):
        return [clean_exif_data(v) for v in value]
    if isinstance(value, dict):
        return {str(k): clean_exif_data(v) for k, v in value.items()}
    if isinstance(value, bytes):
        try:
            text = value.decode('ascii')
            if set(text).issubset(set(string.printable)):
                return text
        except UnicodeError:
            pass
        return 'BASE64|' + base64.b64encode(value).decode()
    if isinstance(value, str):
        try:
            return parse_exif_timestamp(value)
        except ValueError:
            # exif text is incorrectly decoded
            return ftfy.fix_text(value)

    return repr(value)


ExifData = namedtuple('ExifData', 'description, created, artist, copyright')


def get_metadata(data: dict) -> ExifData:
    """Extract the most relevant exif fields"""
    return ExifData(
        description=data.get('ImageDescription', ''),
        created=data.get('DateTimeOriginal') or data.get('DateTime', ''),
        copyright=data.get('Copyright', ''),
        artist=data.get('Artist', ''),
    )


def parse_exif_timestamp(timestamp: str) -> Union[datetime, str]:
    """Exif timestamp of format"""
    dt = timezone.datetime.strptime(timestamp, '%Y:%m:%d %H:%M:%S')
    return timezone.make_aware(dt, timezone.get_default_timezone())
