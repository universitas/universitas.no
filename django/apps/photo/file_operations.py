import base64
import hashlib
from io import BytesIO
import logging
from pathlib import Path
from typing import Dict, Union

import PIL
from django.core.files import File as DjangoFile
import imagehash

try:
    from storages.backends.s3boto3 import S3Boto3StorageFile as BotoFile
except ImportError:
    BotoFile = type('BotoFileFallbackClass', (), {})

logger = logging.getLogger(__name__)
Fileish = Union[str, bytes, Path, DjangoFile]
FINGERPRINT_SIZE = 16


def image_from_fingerprint(fingerprint):
    """Create tiny fingerprint image from 11x11 b64 encoded string
    for image hash comparisons"""
    data = base64.b64decode(fingerprint)
    size = int(len(data)**0.5)
    return PIL.Image.frombytes('L', (size, size), data)


def image_to_fingerprint(image, size=FINGERPRINT_SIZE):
    """Create b64encoded image signature for image hash comparisons"""
    data = image.copy().convert('L').resize((size, size)).getdata()
    return base64.b64encode(bytes(data)).decode()


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


def pil_image(fp: Fileish) -> PIL.Image.Image:
    if isinstance(fp, PIL.Image.Image):
        return fp
    blob = BytesIO(read_data(fp))
    return PIL.Image.open(blob)


def valid_image(fp: Fileish) -> bool:
    try:
        pil_image(fp).verify()
        return True
    except (SyntaxError, OSError, RuntimeError, ValueError, TypeError) as e:
        return False


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


def get_imagehashes(fp: Fileish,
                    size=FINGERPRINT_SIZE) -> Dict[str, imagehash.ImageHash]:
    """Calculate perceptual hashes for comparison of identical images"""
    try:
        img = pil_image(fp)
        thumb = img.resize((size, size), PIL.Image.BILINEAR).convert('L')
        return dict(
            ahash=imagehash.average_hash(thumb),
            phash=imagehash.phash(thumb),
            whash=imagehash.whash(thumb),
            dhash=imagehash.dhash(thumb),
        )
    except OSError:  # corrupt image file probably
        return {}


def get_exif(fp: Fileish) -> dict:
    try:
        return pil_image(fp)._getexif() or {}
    except (AttributeError, OSError):
        pass  # file format has no exif.
    except Exception:  # unexpected error
        logger.exception('Cannot extract exif data')
    return {}


def get_mimetype(fp: Fileish) -> str:
    return PIL.Image.MIME.get(pil_image(fp).format)


def s3_md5(s3key):
    """Hexadecimal md5 hash of a Fileish stored in Amazon S3"""
    return s3key.etag.strip('"').strip("'")
