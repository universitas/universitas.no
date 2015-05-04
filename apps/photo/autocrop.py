import numpy as np
import cv2


def opencv_image(imagefile, size=400, grayscale=True):
    """ Convert ImageFile into a cv2 image for image processing. """
    cv2img = cv2.imread(imagefile.source_file.file.name)

    width, height = cv2img.shape[0], cv2img.shape[1]
    if width > height:
        height, width = size * height // width, size
    else:
        height, width = size, size * width // height

    cv2img = cv2.resize(cv2img, (height, width))
    if grayscale:
        cv2img = cv2.cvtColor(cv2img, cv2.COLOR_BGR2GRAY)
    return cv2img


def detect_faces(cv2img):
    """ Detects faces in image and adjust cropping. """
    datafolder = '/srv/local.universitas.no/source/apps/photo/haarcascades/'
    face_cascade = cv2.CascadeClassifier(datafolder + 'haarcascade_frontalface_default.xml')

    faces = face_cascade.detectMultiScale(cv2img, 1.3, 5)

    from_left, from_top = None, None
    horizontal_faces, vertical_faces = [], []

    for (face_x, face_y, face_w, face_h) in faces:
        # Create weighted sum here.
        horizontal_faces.extend([face_y + face_h / 2] * face_h)
        vertical_faces.extend([face_x + face_w / 2] * face_w)

    if horizontal_faces:
        # Found faces. Sum the matches together to find a mid point.
        from_left = sum(horizontal_faces) / len(horizontal_faces)
        from_top = sum(vertical_faces) / len(vertical_faces)

    return from_left, from_top


def detect_corners(cv2img):
    """ Detect features in the image to determine cropping """
    corners = cv2.goodFeaturesToTrack(cv2img, 25, 0.01, 10)
    corners = np.int0(corners)
    from_left = corners.ravel()[::2].mean()
    from_top = corners.ravel()[1::2].mean()

    return from_left, from_top

imgfile.from_left = round(100 * from_left / cv2img.shape[0])
imgfile.from_top = round(100 * from_top / cv2img.shape[1])


import numpy


def fastsieve(limit):
    """ Find all primes less than limit.

    >>> fastsieve(23)
    [2, 3, 5, 7, 11, 13, 17, 19]
    >>> fastsieve(10e5)[-50000::10000]
    [331207, 460571, 592129, 726139, 862067]
    """
    if limit <= 3:
        return [2] if limit == 3 else []
    sieve = numpy.ones(limit / 3 + (limit % 6 == 2), dtype=numpy.bool)
    for i in range(1, int(limit ** 0.5) // 3 + 1):
        if sieve[i]:
            k = 3 * i + 1 | 1
            sieve[k * k / 3::2 * k] = False
            sieve[k * (k - 2 * (i & 1) + 4) / 3::2 * k] = False
    return list(numpy.r_[2, 3, ((3 * numpy.nonzero(sieve)[0][1:] + 1) | 1)])


def mirptall(limit):
    """ calculate number of mirptall between 0 and limit

    >>> mirptall(10)
    0
    >>> mirptall(10000)
    240
    """
    primes = ['%i' % f for f in fastsieve(limit)]
    return sum(1 for r in set(p[::-1] for p in primes).intersection(primes) if r != r[::-1])


# kommentar
sum(
    (x * y) % 100 and sorted('%i' % (x * y)) == sorted('%i%i' % (x, y))
    for x in range(10, 100)
    for y in range(max(x, 1000 // x), 100)
)