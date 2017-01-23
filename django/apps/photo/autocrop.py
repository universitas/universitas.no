""" Face and feature detection with opencv. """

import os
import logging
from collections import namedtuple
logger = logging.getLogger(__name__)


try:
    import cv2
    import numpy
except ImportError:
    pass


Cropping = namedtuple('Cropping', ['top', 'left', 'diameter'])

CASCADE_FILE = os.path.join(
    os.path.dirname(__file__),
    'haarcascade_frontalface_default.xml'
)


def opencv_image(instance, size=400):
    """ Convert ImageFile into a cv2 image for image processing. """

    instance.source_file.open()
    nparr = numpy.fromstring(instance.source_file.read(), numpy.uint8)

    cv2img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    cv2img = cv2.cvtColor(cv2img, cv2.COLOR_BGR2RGB)
    width, height = cv2img.shape[0], cv2img.shape[1]
    if width > height:
        height, width = size * height // width, size
    else:
        height, width = size, size * width // height

    cv2img = cv2.resize(cv2img, (height, width))
    return cv2img


def autocrop(instance):
    """ Try different algorithms, change crop and save model. """
    try:
        grayscale_image = cv2.cvtColor(
            opencv_image(instance), cv2.COLOR_RGB2GRAY)
    except AttributeError as err:  # No file access?
        logger.exception('Autocrop failed')
        return
    cropping, faces = detect_faces(grayscale_image)
    if faces == 1:
        cropping_method = instance.CROP_PORTRAIT
    elif faces > 1:
        cropping_method = instance.CROP_FACES
    else:
        cropping = detect_features(grayscale_image)
        cropping_method = instance.CROP_FEATURES

    left = int(round(100 * cropping.left /
                     grayscale_image.shape[1]))
    top = int(round(100 * cropping.top /
                    grayscale_image.shape[0]))
    diameter = int(round(100 * cropping.diameter /
                         min(grayscale_image.shape)))

    del(grayscale_image)  # Might save some memory?

    diameter = min(100, diameter)

    return left, top, diameter, cropping_method


def detect_faces(cv2img,):
    """ Detects faces in image and adjust cropping. """
    # http://docs.opencv.org/trunk/modules/objdetect/doc/cascade_classification.html
    # cv2.CascadeClassifier.detectMultiScale(image[, scaleFactor[,
    # minNeighbors[, flags[, minSize[, maxSize]]]]])
    # cascade – Haar classifier cascade (OpenCV 1.x API only). It can
    # be loaded from XML or YAML file using Load(). When the cascade is
    # not needed anymore, release it using
    # cvReleaseHaarClassifierCascade(&cascade).
    # image – Matrix of the type CV_8U containing an image where
    # objects are detected.
    # objects – Vector of rectangles where each rectangle contains the
    # detected object, the rectangles may be partially outside the
    # original image.
    # numDetections – Vector of detection numbers for the corresponding
    # objects. An object’s number of detections is the number of
    # neighboring positively classified rectangles that were joined
    # together to form the object.
    # scaleFactor – Parameter specifying how much the image size is
    # reduced at each image scale.
    # minNeighbors – Parameter specifying how many neighbors each
    # candidate rectangle should have to retain it.
    # flags – Parameter with the same meaning for an old cascade as in
    # the function cvHaarDetectObjects. It is not used for a new
    # cascade.
    # minSize – Minimum possible object size. Objects smaller than that
    # are ignored.
    # maxSize – Maximum possible object size. Objects larger than that
    # are ignored.
    # outputRejectLevels – Boolean. If True, it returns the
    # rejectLevels and levelWeights. Default value is False.

    face_cascade = cv2.CascadeClassifier(CASCADE_FILE)
    # faces = face_cascade.detectMultiScale(cv2img,)
    faces = face_cascade.detectMultiScale(
        cv2img, minSize=(50, 50), minNeighbors=10)

    # faces = sorted(faces, reverse=True, key=lambda l, t, w, h:
    # w*h)[:max_matches]
    horizontal_faces, vertical_faces = [], []
    box = {}
    for (face_left, face_top, face_width, face_height) in faces:
        # Create weighted average of faces. Bigger is heavier.
        horizontal_faces.extend(
            [face_left + face_width / 2] * face_width)
        vertical_faces.extend(
            [face_top + face_height / 2] * face_height)

        face_right = face_left + face_width
        face_bottom = face_top + face_height
        box['left'] = min(
            face_left, box.get('left', face_left))
        box['top'] = min(
            face_top, box.get('top', face_top))
        box['right'] = max(
            face_right, box.get('right', face_right))
        box['bottom'] = max(
            face_bottom, box.get('bottom', face_bottom))

    if horizontal_faces:
        left = sum(horizontal_faces) / len(horizontal_faces)
        top = sum(vertical_faces) / len(vertical_faces)
        diameter = max(
            box['right'] - box['left'],
            box['bottom'] - box['top']
        )
        return Cropping(
            left=left, top=top, diameter=diameter), len(faces)
    else:
        # No faces found
        return None, len(faces)


def detect_features(cv2img):
    """ Detect features in the image to determine cropping """
    # http://docs.opencv.org/trunk/modules/imgproc/doc/feature_detection.html
    # cv2.goodFeaturesToTrack(image, maxCorners, qualityLevel,
    # minDistance[, corners[, mask[, blockSize[, useHarrisDetector[,
    # k]]]]]) → corners
    # image – Input 8-bit or floating-point 32-bit, single-channel
    # image.
    # corners – Output vector of detected corners.
    # maxCorners – Maximum number of corners to return. If there are
    # more corners than are found, the strongest of them is returned.
    # qualityLevel – Parameter characterizing the minimal accepted
    # quality of image corners. The parameter value is multiplied by
    # the best corner quality measure, which is the minimal eigenvalue
    # (see cornerMinEigenVal() ) or the Harris function response (see
    # cornerHarris() ). The corners with the quality measure less than
    # the product are rejected. For example, if the best corner has the
    # quality measure = 1500, and the qualityLevel=0.01 , then all the
    # corners with the quality measure less than 15 are rejected.
    # minDistance – Minimum possible Euclidean distance between the
    # returned corners.
    # mask – Optional region of interest. If the image is not empty (it
    # needs to have the type CV_8UC1 and the same size as image ), it
    # specifies the region in which the corners are detected.
    # blockSize – Size of an average block for computing a derivative
    # covariation matrix over each pixel neighborhood. See
    # cornerEigenValsAndVecs() .
    # useHarrisDetector – Parameter indicating whether to use a Harris
    # detector (see cornerHarris()) or cornerMinEigenVal().
    # k – Free parameter of the Harris detector.

    corners = cv2.goodFeaturesToTrack(cv2img, 25, 0.01, 10)
    corners = numpy.int0(corners)
    xx = corners.ravel()[0::2]
    yy = corners.ravel()[1::2]
    w = max(xx) - min(xx)
    h = max(yy) - min(yy)
    d = max(w, h)
    x = xx.mean()
    y = yy.mean()
    return Cropping(left=x, top=y, diameter=d)
