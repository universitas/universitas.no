import random
from PIL import Image, ImageOps, ImageFilter, ImageChops
from faker import Factory
from pathlib import Path
from io import BytesIO

from django.core.files import File
from django.utils import timezone

from apps.stories.models import Story, StoryImage, StoryType
from apps.photo.models import ImageFile, ProfileImage
from apps.contributors.models import Contributor


SOURCE_IMG = Path(__file__).parent / 'judgement2.jpg'
FAKE = Factory.create('no')


def random_image(sourceimg=None, size=(200, 100)):
    """Scramble source image to create placeholder image"""
    if sourceimg is None:
        sourceimg = Image.open(str(SOURCE_IMG))
    width, height = size
    sqrt2 = 2 ** .5
    regionsize = int(min(
        max(width, height) * sqrt2,
        min(sourceimg.size),
    ))
    inscribed = int(regionsize / sqrt2)
    x = random.randint(0, sourceimg.width - regionsize)
    y = random.randint(0, sourceimg.height - regionsize)
    subsection = sourceimg.crop([x, y, x + regionsize, y + regionsize])
    angle = random.randint(0, 360)
    rotated = subsection.rotate(angle)
    ratio = width / height
    if ratio > 1:
        cw, ch = inscribed, inscribed / ratio
    else:
        cw, ch = inscribed * ratio, inscribed
    cropbox = (
        (regionsize - cw) / 2,
        (regionsize - ch) / 2,
        (regionsize + cw) / 2,
        (regionsize + ch) / 2,
    )
    cropped = rotated.crop(cropbox)
    blur = ImageFilter.GaussianBlur(1)
    result = cropped.resize((width, height))
    enhanced = result.filter(blur)
    enhanced = random_bands(enhanced)
    blended = ImageChops.blend(result, enhanced, 0.5)
    blended = ImageChops.blend(blended, ImageOps.equalize(blended), 0.5)
    blended = blended.filter(blur)
    return blended


def random_bands(sourceimg):
    """Randomly scramble color bands in image"""
    r, g, b = sourceimg.split()
    bands = [r, g, b]
    dice = [True] * 2 + [False] * 3
    random.shuffle(dice)
    if dice.pop():
        random.shuffle(bands)
    negbands = (ImageChops.invert(b) for b in bands)
    bands = [n if d else b for (b, n, d) in zip(bands, negbands, dice)]
    newimg = Image.merge('RGB', bands)
    newimg = ImageOps.equalize(newimg)
    return newimg


def fake_imagefile(size=(1200, 600), class_=ImageFile, fake=FAKE, **kwargs):
    image = random_image(size=size)
    blob = BytesIO()
    image.convert('RGB').save(blob, 'JPEG')
    filename = kwargs.pop('filename', fake.file_name(extension='jpg'))
    instance = class_(**kwargs)
    content = File(blob)
    instance.source_file.save(filename, content)
    return instance


def fake_contributor(fake=FAKE, **kwargs):
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


def fake_story_content(fake=FAKE):
    sections = "@tit:{title}", "@ing:{lede}", "@txt:{content}"
    title = fake.sentence(random.choice([1, 2, 3]))[:-1]
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


def create_fake_content(contributors=3, stories=10, delete_existing=False,
                        verbosity=0):
    if delete_existing:
        Story.objects.all().delete()
        Contributor.objects.all().delete()
    for n in range(contributors):
        fake_contributor()
    for n in range(stories):
        fake_story()
