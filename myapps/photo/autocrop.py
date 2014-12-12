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
    datafolder = '/srv/local.universitas.no/source/myapps/photo/haarcascades/'
    face_cascade = cv2.CascadeClassifier(datafolder + 'haarcascade_frontalface_default.xml')

    faces = face_cascade.detectMultiScale(cv2img, 1.3, 5)

    horizontal_centre, vertical_centre = None, None
    horizontal_faces, vertical_faces = [], []

    for (face_x, face_y, face_w, face_h) in faces:
        # Create weighted sum here.
        horizontal_faces.extend([face_y + face_h / 2] * face_h)
        vertical_faces.extend([face_x + face_w / 2] * face_w)

    if horizontal_faces:
        # Found faces. Sum the matches together to find a mid point.
        horizontal_centre = sum(horizontal_faces) / len(horizontal_faces)
        vertical_centre = sum(vertical_faces) / len(vertical_faces)

    return horizontal_centre, vertical_centre

def detect_corners(cv2img):
    """ Detect features in the image to determine cropping """
    corners = cv2.goodFeaturesToTrack(cv2img, 25, 0.01, 10)
    corners = np.int0(corners)
    horizontal_centre = corners.ravel()[::2].mean()
    vertical_centre = corners.ravel()[1::2].mean()

    return horizontal_centre, vertical_centre

imgfile.horizontal_centre = round(100 * horizontal_centre / cv2img.shape[0])
imgfile.vertical_centre = round(100 * vertical_centre / cv2img.shape[1])
