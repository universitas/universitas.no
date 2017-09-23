"""Tests of the cropping detectors."""

import json
from pathlib import PosixPath as Path

import pytest
from apps.photo.cropping.boundingbox import Box
from apps.photo.cropping.crop_detector import (
    Cascade, Feature, FeatureDetector, KeypointDetector, MockFeatureDetector
)


@pytest.fixture
def testimage():
    img = Path(__file__).parent / 'fixtureimage.jpg'
    assert img.exists()
    return img


@pytest.fixture
def valid_cascade_file():
    return 'haarcascade_smile.xml'


@pytest.fixture
def invalid_cascade_file():
    return 'no_such_cascade.jpg'


def test_cascade(valid_cascade_file, invalid_cascade_file):
    nose_cascade = Cascade('nose', valid_cascade_file)
    assert not nose_cascade.classifier.empty()

    with pytest.raises(RuntimeError):
        Cascade('invalid', invalid_cascade_file)


@pytest.mark.parametrize('Detector', FeatureDetector.__subclasses__())
def test_cropdetector(Detector, testimage):
    detector = Detector(n=10)
    features = detector.detect_features(testimage)
    assert len(features) >= 1
    assert 0 < sum(features).size < 1
    keys = {'x', 'y', 'width', 'height', 'label', 'weight'}
    assert set(features[0].serialize().keys()) == keys


def test_serialize_and_deserialize():
    feature = Feature(5, 'hello', 1, 2, 4, 9)
    dump = json.dumps(feature.serialize())
    data = json.loads(dump)
    assert data == {
        "label": "hello",
        "x": 1,
        "y": 2,
        "width": 3,
        "height": 7,
        "weight": 5
    }
    clone = Feature.deserialize(data)
    assert clone == feature


def test_that_keypointdetector_returns_correct_number_of_features(testimage):
    detector = KeypointDetector(n=5)
    features = detector.detect_features(testimage)
    assert len(features) == 5


def test_that_both_file_and_bytes_work(testimage):
    detector = MockFeatureDetector(n=3)
    data = testimage.read_bytes()
    features = detector.detect_features(testimage)
    features2 = detector.detect_features(data)
    assert len(features) == 3
    assert features == features2


def test_feature_operators():
    f1 = Feature(1, 'f1', 1, 2, 3, 4)
    f2 = Feature(2, 'f2', 2, 1, 4, 3)
    combined = f1 + f2
    assert combined == Box(1, 1, 4, 4)
    intersection = f1 & f2
    assert intersection == Box(2, 2, 3, 3)
    double = f1 * 2
    assert double == Feature(2, 'f1', 0, 1, 4, 5)
