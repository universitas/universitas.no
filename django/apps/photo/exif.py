""" Make image file data serializable """
import base64
import string

from PIL import ExifTags, Image


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
    tags = Image.open(fp)._getexif()
    if not tags:
        return {}
    data = {ExifTags.TAGS.get(k, k): v for k, v in tags.items()}
    return clean_data(data)
