import hashlib
import logging
from io import BytesIO
from pathlib import Path
from typing import IO, Any, Union

import PIL

import imagehash
from django.core.files import File as DjangoFile

try:
    from storages.backends.s3boto import S3BotoStorageFile as BotoFile
except ImportError:
    BotoFile = type('BotoFileFallbackClass', (), {})

logger = logging.getLogger(__name__)
Fileish = Union[str, bytes, Path, DjangoFile]


def read_data(value: Fileish) -> bytes:
    """Read raw data from Fileish like object"""
    if isinstance(value, str):
        return Path(value).read_bytes()
    elif isinstance(value, bytes):
        return value
    elif isinstance(value, Path):
        return value.read_bytes()
    elif isinstance(value, DjangoFile):
        value.open('rb')
        return value.read()
    else:
        # try:
        #     value.seek(0)
        # except AttributeError:
        #     pass
        return value.read()
    # elif isinstance(value, BotoFile):
    #     return value.read()


def pil_image(fp: Fileish) -> PIL.Image:
    blob = BytesIO(read_data(fp))
    return PIL.Image.open(blob)


def get_md5(fp: Fileish) -> str:
    """Hexadecimal md5 hash of a Fileish stored on local disk"""
    hasher = hashlib.md5(read_data(fp))
    return hasher.hexdigest()


def get_mtime(file: Union[Path, str]) -> int:
    """Modification time"""
    return int(Path(file).stat().st_mtime)


def get_filesize(fp: Fileish) -> int:
    """Get file size in bytes"""
    if isinstance(fp, Path):
        return fp.stat().st_size
    else:
        return len(read_data(fp))


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
