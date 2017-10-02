import hashlib
import logging
from io import BytesIO
from pathlib import Path
from typing import IO, Any, Union

import PIL

import imagehash
from django.core.files import File as DjangoFile

logger = logging.getLogger(__name__)
Fileish = Union[str, bytes, Path, IO[Any], DjangoFile]


def read_data(value: Fileish) -> bytes:
    """Read raw data from Fileish like object"""
    if isinstance(value, str):
        fp = Path(value).open('rb')
    elif isinstance(value, bytes):
        fp = BytesIO(value)
    elif isinstance(value, Path):
        fp = value.open('rb')
    elif isinstance(value, DjangoFile):
        if value.closed:
            value.open()  # type: ignore
        fp = value
    else:
        fp = value
    try:
        fp.seek(0)
    except:
        pass
    try:
        return fp.read()
    finally:
        try:
            fp.close()
        except:
            pass


def pil_image(fp: Fileish) -> PIL.Image:
    blob = BytesIO(read_data(fp))
    return PIL.Image.open(blob)


def get_md5(fp: Fileish) -> str:
    """Hexadecimal md5 hash of a Fileish stored on local disk"""
    hasher = hashlib.md5(read_data(fp))
    return hasher.hexdigest()


def get_imagehash(fp, size=11) -> imagehash.ImageHash:
    """Calculate perceptual hash for comparison of identical images"""
    img = pil_image(fp).convert('L').resize((size, size))
    return imagehash.dhash(img)


def get_exif(fp: Fileish) -> dict:
    try:
        return pil_image(fp)._getexif() or {}
    except AttributeError:
        pass  # file format has no exif.
    except Exception:
        logger.exception('Cannot extract exif data')
    return {}


def s3_md5(s3key):
    """Hexadecimal md5 hash of a Fileish stored in Amazon S3"""
    return s3key.etag.strip('"').strip("'")
