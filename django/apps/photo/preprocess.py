from io import BytesIO
from django.db import models
from .exif import serialize_exif, get_metadata, sanitize_image_exif
from pathlib import Path
import PIL

SIZE_LIMIT = 4_000  # Maximum width or height of uploads
BYTE_LIMIT = 3_000_000  # Maximum filesize of upload or compress
TASK_DELAY = 5  # Delay further image processing for N seconds
IMAGE_QUALITY = 80  # Pillow image quality


class ProcessImage(models.Model):
    """Post process image files after upload to reduce filesize and normalize
    exif data."""

    class Meta:
        abstract = True

    def __save___(self, *args, **kwargs):
        """Check image file, compress if needed, and record metadata"""
        try:
            # is image local temporary uploaded file
            temp_file = self.original.temporary_file_path()
        except AttributeError:
            super().__save__(*args, **kwargs)
        else:
            # save original as None, and create a queued task
            self.original = None
            super().__save__(*args, **kwargs)
            # queue further processing avoid web server delays
            from .tasks import process_image_upload
            process_image_upload.apply_async(
                args=[self.pk, temp_file],
                countdown=TASK_DELAY,
            )

    def process_uploaded_file(self, pim):
        file_format = pim.format
        exif_bytes = sanitize_image_exif(pim)
        self.read_metadata_from_imagefile(pim)
        pim = self.rotate_image(pim)
        pim = self.reduce_dimensions(pim)
        self.save_original(pim, exif_bytes, file_format, save=False)

    def reduce_dimensions(self, pim):
        """Shrink large images"""
        if any([
            pim.width > SIZE_LIMIT,
            pim.height > SIZE_LIMIT,
        ]):
            pim.thumbnail(
                size=(SIZE_LIMIT, SIZE_LIMIT),
                resample=PIL.Image.LANCZOS,
            )
        return pim

    def save_original(self, pim, exif=b'', format='jpeg', save=True):
        self.dimensions = pim.width, pim.height
        blob = BytesIO()
        pim.save(blob, format, exif=exif, quality=IMAGE_QUALITY)
        self.stat.size = self.stat.md5 = None
        self.delete_thumbnails()
        self.original.save(self.filename, blob, save=save)

    def rotate_image(self, pim):
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
