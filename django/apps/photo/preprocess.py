from io import BytesIO
import logging
from pathlib import Path
import shutil
import tempfile

import PIL
from django.conf import settings
from django.db import models

from .exif import get_metadata, sanitize_image_exif, serialize_exif

IMAGE_AREA_LIMIT = 16_000_000  # Maximum image area (16 megapixels)
TASK_DELAY = 0  # Delay further image processing for N seconds
IMAGE_QUALITY = 90  # Pillow image quality


class ProcessImage(models.Model):
    """Post process image files after upload to reduce filesize and normalize
    exif data."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """Check image file, compress if needed, and record metadata"""
        try:
            # is image local temporary uploaded file
            temp_file = Path(self.original.file.temporary_file_path())
        except (AttributeError, ValueError):
            super().save(*args, **kwargs)
        else:
            # save original as None, and create a queued task

            assert temp_file.exists(), 'file should exist'

            new_temp = tempfile.NamedTemporaryFile(
                dir=settings.FILE_UPLOAD_TEMP_DIR,
                prefix='persisted.',
                delete=False,
            ).name
            shutil.copy(temp_file, new_temp)
            self.original = None
            self.dimensions = 100, 100
            super().save(*args, **kwargs)
            # queue further processing avoid web server delays
            from .tasks import process_image_upload
            task = process_image_upload.si(self.pk, new_temp)
            task.apply_async(countdown=TASK_DELAY)

    def process_uploaded_file(self, pim):
        """Clean up meta data and compress large images"""
        file_format = pim.format
        exif_bytes = sanitize_image_exif(pim)
        self.read_metadata_from_imagefile(pim)
        pim = self.rotate_image(pim)
        pim = self.reduce_dimensions(pim)
        self.save_original(pim, exif_bytes, file_format, save=False)

    def reduce_dimensions(self, pim):
        """Shrink large images"""
        resize_by = (IMAGE_AREA_LIMIT / (pim.width * pim.height))**0.5
        if resize_by < 1:
            size = [int(d * resize_by) for d in [pim.width, pim.height]]
            pim.thumbnail(size, resample=PIL.Image.LANCZOS)
        return pim

    def save_original(self, pim, exif=b'', format='jpeg', save=True):
        """Save processed image to storage backend"""
        self.dimensions = pim.width, pim.height
        blob = BytesIO()
        pim.save(blob, format, exif=exif, quality=IMAGE_QUALITY)
        self.stat.size = self.stat.md5 = None
        self.delete_thumbnails()
        self.original.save(self.filename, blob, save=save)

    def rotate_image(self, pim):
        """Rotate image file based on exif rotation"""
        orientation = self.exif_data.get('Orientation', 1)
        degrees = {1: 0, 3: 180, 6: 270, 8: 90}.get(orientation)
        if degrees:
            pim = pim.rotate(degrees, expand=True)
        return pim

    def read_metadata_from_imagefile(self, pim):
        """Update ImageFile from image metadata"""
        self.exif_data = serialize_exif(pim)
        if not self.description:
            self.description = self.metadata.description
        if not self.copyright_information:
            self.copyright_information = self.metadata.copyright
        if self.metadata.created:
            self.created = self.metadata.created

    @property
    def metadata(self):
        """Exif metadata as namedtuple"""
        return get_metadata(self.exif_data)
