import cv2
import numpy
import abc
from .boundingbox import Box
from typing import List, Union
from collections import OrderedDict
from numpy import ndarray as CVImage
from pathlib import Path

# type annotation aliases
Image = Union[Path, bytes]


def get_haarcascade(filename: str) -> Path:
    cascade_dir = (Path(cv2.__file__) /
                   '../../../../share/OpenCV/haarcascades').resolve()
    if not cascade_dir.exists():
        raise RuntimeError('Cannot find OpenCV haarcascades')
    file = cascade_dir / filename
    if not file.exists():
        raise RuntimeError('Cannot find file {file}'.format(file=file))
    return file


class Feature(Box):

    """Rectangular region containing salient image feature"""

    def __init__(self, weight: float, label: str,
                 *args, **kwargs) -> None:
        self.weight = weight
        self.label = label
        super().__init__(*args, **kwargs)

    def __lt__(self, other):
        """Less than comparison"""
        # self < other
        # this enables sorting
        return self.weight < other.weight

    def __mul__(self, factor: float) -> 'Feature':
        box = super().__mul__(factor)
        return self.__class__(
            label=self.label,
            weight=self.weight * factor,
            **box.__dict__,
        )

    def serialize(self, precision: int=3) -> OrderedDict:
        """Build a json serializable dictionary with the
        attributes relevant for client side visualisation of
        the Feature."""

        def floatformat(f):
            return round(f, precision)

        return OrderedDict([
            ('label', self.label),
            ('x', floatformat(self.left)),
            ('y', floatformat(self.top)),
            ('width', floatformat(self.width)),
            ('height', floatformat(self.height)),
            ('weight', floatformat(self.weight)),
        ])

    @classmethod
    def deserialize(cls, data: dict) -> 'Feature':
        left = float(data.get('x'))
        top = float(data.get('y'))
        bottom = top + float(data.get('height'))
        right = left + float(data.get('width'))
        return cls(
            label=data.get('label', 'feature'),
            weight=data.get('weight', 0),
            left=left, top=top, bottom=bottom, right=right
        )


class FeatureDetector(abc.ABC):

    @abc.abstractmethod
    def __init__(self, n: int) -> None:
        ...

    @abc.abstractmethod
    def detect_features(self, source: Image) -> List[Feature]:
        """Find the most salient features of the image."""
        ...

    @staticmethod
    def _opencv_image(source: Image, resize: int=0) -> CVImage:
        """Read image file to grayscale openCV int array.

        The OpenCV algorithms works on a two dimensional
        numpy array integers where 0 is black and 255 is
        white. Color images will be converted to grayscale.
        """
        if isinstance(source, Path):
            assert source.exists(), 'file {} not found'.format(source)
            source = source.read_bytes()
        if not isinstance(source, bytes):
            raise TypeError('incorrect type')

        data = numpy.fromstring(source, numpy.uint8)
        cv_image = cv2.imdecode(data, cv2.IMREAD_COLOR)
        cv_image = cv2.cvtColor(
            cv_image, cv2.COLOR_BGR2GRAY)
        if resize > 0:
            w, h = cv_image.shape[1::-1]  # type: int, int
            multiplier = (resize ** 2 / (w * h)) ** 0.5
            dimensions = tuple(
                int(round(d * multiplier)) for d in (w, h))
            cv_image = cv2.resize(
                cv_image, dimensions,
                interpolation=cv2.INTER_AREA)
        return cv_image

    @staticmethod
    def _resize_feature(
            feature: Feature, cv_image: CVImage) -> Feature:
        """Convert a Feature to a relative coordinate system.

        The output will be in a normalized coordinate system
        where the image width and height are both 1.
        Any part of the Feature that overflows the image
        frame will be truncated.
        """
        img_h, img_w = cv_image.shape[:2]  # type: int, int
        feature = Feature(
            label=feature.label,
            weight=feature.weight / (img_w * img_h),
            left=max(0, feature.left / img_w),
            top=max(0, feature.top / img_h),
            right=min(1, feature.right / img_w),
            bottom=min(1, feature.bottom / img_h),
        )
        return feature


class MockFeatureDetector(FeatureDetector):

    """Example feature detector interface."""

    def __init__(self, n: int=3, imagesize: int=200) -> None:
        self._number = n
        self._size = imagesize
        self._circles = [m / n for m in range(1, n + 1)]

    def detect_features(self, source: Image) -> List[Feature]:
        """Concentric features at center of the image"""
        cv_image = self._opencv_image(source, self._size)
        img_h, img_w = cv_image.shape[:2]
        middle = Feature(0, 'mock keypoint', 0, 0, img_w, img_h)
        middle.width = middle.height = min(img_w, img_h)
        middle = self._resize_feature(middle, cv_image)
        return [middle * size for size in self._circles]


class KeypointDetector(FeatureDetector):

    """Feature detector using OpenCVs ORB algorithm"""

    LABEL = 'ORB keypoint'

    def __init__(self, n: int=10, padding: float=1.0,
                 imagesize: int=200, **kwargs) -> None:
        self._imagesize = imagesize
        self._padding = padding
        _kwargs = {
            "nfeatures": n + 1,
            "scaleFactor": 1.5,
            "patchSize": self._imagesize // 10,
            "edgeThreshold": self._imagesize // 10,
            "scoreType": cv2.ORB_FAST_SCORE,
        }
        _kwargs.update(kwargs)
        self._detector = cv2.ORB_create(**_kwargs)

    def detect_features(self, source: Image) -> List[Feature]:
        """Find interesting keypoints in the image."""
        cv_image = self._opencv_image(source, self._imagesize)
        keypoints = self._detector.detect(cv_image)
        features = [self._kp_to_feature(kp)
                    for kp in keypoints]
        features = [self._resize_feature(ft, cv_image)
                    for ft in features]
        return sorted(features, reverse=True)

    def _kp_to_feature(self, kp: cv2.KeyPoint) -> Feature:
        """Convert KeyPoint to Feature"""
        x, y = kp.pt
        radius = kp.size / 2
        weight = radius * kp.response ** 2
        return Feature(
            label=self.LABEL,
            weight=weight,
            left=x - radius,
            top=y - radius,
            right=x + radius,
            bottom=y + radius
        ) * self._padding


class Cascade:

    """Wrapper for Haar cascade classifier"""

    def __init__(self, label: str, filename: str,
                 size: float=1, weight: float=100) -> None:
        self.label = label
        self.size = size
        self.weight = weight
        self._file = get_haarcascade(filename)

        self.classifier = cv2.CascadeClassifier(str(self._file))

        if self.classifier.empty():
            msg = ('The input file: "{}" is not a valid '
                   'cascade classifier').format(self._file)
            raise RuntimeError(msg)


class FaceDetector(FeatureDetector):

    """Face detector using OpenCVs Viola-Jones algorithm
    and Haar cascade training data files classifying human
    frontal and profile faces."""

    _CASCADES = [
        Cascade('frontal face',
                'haarcascade_frontalface_default.xml',
                size=1.0, weight=100),
        Cascade('alt face',
                'haarcascade_frontalface_alt.xml',
                size=1.2, weight=100),
        Cascade('profile face',
                'haarcascade_profileface.xml',
                size=0.9, weight=50),
    ]

    def __init__(self, n: int=10, padding: float=1.2,
                 imagesize: int=600, **kwargs) -> None:
        self._number = n
        self._imagesize = imagesize
        self._padding = padding
        self._cascades = self._CASCADES
        minsize = max(25, imagesize // 20)
        self._kwargs = {
            "minSize": (minsize, minsize),
            "scaleFactor": 1.2,
            "minNeighbors": 5,
        }
        self._kwargs.update(kwargs)

    def detect_features(self, source: Image) -> List[Feature]:
        """Find faces in the image."""
        cv_image = self._opencv_image(source, self._imagesize)
        features = []  # type: List[Feature]

        for cascade in self._cascades:
            padding = self._padding * cascade.size
            detect = cascade.classifier.detectMultiScale
            faces = detect(cv_image, **self._kwargs)

            for left, top, width, height in faces:
                weight = height * width * cascade.weight
                face = Feature(
                    label=cascade.label,
                    weight=weight,
                    left=left,
                    top=top,
                    right=left + width,
                    bottom=top + height,
                )
                face = face * padding
                face = self._resize_feature(face, cv_image)
                features.append(face)

        return sorted(features, reverse=True)[:self._number]


class HybridDetector(FeatureDetector):

    """Detector using a hybrid strategy to find salient
    features in images.

    Tries to detect_features faces first. If the faces are
    small relative to the image, will detect_features
    keypoints as well.  If no faces are detected, will fall
    back to a pure KeypointDetector."""

    BREAKPOINT = 0.15

    def __init__(self, n=10) -> None:
        self._number = n
        self.primary = FaceDetector(n)
        self.fallback = KeypointDetector(n)
        self.breakpoint = self.BREAKPOINT

    def detect_features(self, source: Image) -> List[Feature]:
        """Find faces and/or keypoints in the image."""
        faces = self.primary.detect_features(source)
        if faces and sum(faces).size > self.breakpoint:
            return faces
        features = faces + self.fallback.detect_features(source)
        return features[:self._number]
