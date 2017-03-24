"""Populate app with randomly generated content"""
import random

from PIL import Image, ImageOps, ImageFilter, ImageChops
from io import BytesIO
from faker import Factory
from pathlib import Path

from django.core.files import File
from django.utils import timezone
from math import sqrt

from apps.photo.models import ImageFile, ProfileImage
from apps.stories.models import Story, StoryType, StoryImage
from apps.contributors.models import Contributor


IMG = Image.open(Path(__file__).parent / 'triptych.jpg')
fake = Factory.create('no')


def random_image(img=IMG, size=(200, 100)):
    """Create a random PIL image by messing with a source image"""
    width, height = size
    ratio = width / height
    square = int(min(max(width, height) * sqrt(2), min(img.size)))
    x = random.randint(0, img.width - square)
    y = random.randint(0, img.height - square)
    angle = random.randint(0, 360)

    subsection = img.crop([x, y, x + square, y + square])
    rotated = subsection.rotate(angle)
    inscribed = square / sqrt(2)
    if ratio > 1:
        cw, ch = inscribed, inscribed / ratio
    else:
        cw, ch = inscribed * ratio, inscribed
    cropbox = (
        (square - cw) / 2,
        (square - ch) / 2,
        (square + cw) / 2,
        (square + ch) / 2,
    )
    cropbox = tuple(map(int, cropbox))

    blur = ImageFilter.GaussianBlur(1)
    cropped = rotated.crop(cropbox).resize(size)
    colorized = scramble_colors(cropped)
    blended = ImageChops.blend(cropped, colorized, 0.5).filter(blur)
    equalized = ImageOps.equalize(blended)
    result = ImageChops.blend(blended, equalized, 0.5)
    return result


def scramble_colors(img):
    """randomly scramble colors in image"""
    dice = random.sample([1, 1, 1, 0, 0, 0], 4)
    bands = img.split()
    negbands = (ImageChops.invert(b) for b in bands)
    bands = [n if d else b for (b, n, d) in zip(bands, negbands, dice)]
    dice[-1] and random.shuffle(bands)
    merged = Image.merge('RGB', bands)
    return ImageOps.equalize(merged)


def fake_imagefile(size=(900, 500), class_=ImageFile, **kwargs):
    image = random_image(size=size)
    blob = BytesIO()
    image.convert('RGB').save(blob, 'JPEG')
    filename = kwargs.pop('filename', fake.file_name(extension='jpg'))
    instance = class_(**kwargs)
    content = File(blob)
    instance.source_file.save(filename, content)
    return instance


def fake_contributor(**kwargs):
    name = fake.name()
    filename = '{}.jpg'.format(name).lower()
    byline_photo = fake_imagefile((400, 400), ProfileImage, filename=filename)
    instance = Contributor(
        byline_photo=byline_photo,
        display_name=name,
        phone=fake.phone_number(),
        email=fake.email(),
        verified=True,
    )
    instance.save()
    return instance


def fake_story_image(story, byline):
    imagefile = fake_imagefile(contributor=byline)
    instance = StoryImage(
        parent_story=story,
        caption='foobar',
        imagefile=imagefile,
    )
    instance.save()
    return instance


def random_contributor():
    try:
        return Contributor.objects.order_by('?').first()
    except Contributor.DoesNotExist:
        fake_contributor()


def random_storytype():
    return StoryType.objects.order_by('?').first()


def fake_story_content():
    sections = "@tit:{title}", "@ing:{lede}", "@txt:{content}"
    title = fake.sentence(random.choice([1, 2, 3]))
    lede = ' '.join(fake.sentences(random.choice([1, 2, 3])))
    content = '\n'.join(fake.paragraphs(random.choice([4, 5, 10, 20, 30])))
    return '\n'.join(sections).format(title=title, lede=lede, content=content)


def fake_story():
    photo_by = random_contributor()
    text_by = random_contributor()
    markup = '{}\n@bl: text: {}\n@bl: photo:{}'.format(
        fake_story_content(), text_by, photo_by)

    story = Story(
        story_type=random_storytype(),
        bodytext_markup=markup,
        publication_status=Story.STATUS_PUBLISHED,
        publication_date=timezone.now(),
    )
    story.save()
    numphotos = random.choice([0, 1, 1, 3, 5])
    for _ in range(numphotos):
        fake_story_image(story, photo_by)
    story.refresh_from_db()
    story.full_clean()
    story.frontpagestory_set.all().delete()
    story.save(new=True)
    return story


def main():
    Story.objects.all().delete()
    Contributor.objects.all().delete()
    for n in range(10):
        fake_contributor()
    for n in range(30):
        fake_story()
