import json
import numbers
import typing

import pytest


class Box:
    """Rectangular bounding box"""

    _attrs = ['left', 'top', 'bottom', 'right']

    def __init__(
        self, left: float, top: float, right: float, bottom: float
    ) -> None:
        if top > bottom or left > right:
            raise ValueError('Width and height must be greater than zero')
        self.left = left
        self.top = top
        self.right = right
        self.bottom = bottom

    def __iter__(self) -> typing.Iterator:
        return iter((self.left, self.top, self.right, self.bottom))

    def __repr__(self) -> str:
        cname = self.__class__.__name__
        props = self.__dict__.items()
        kwargs = ['{}={!r}'.format(k, v) for k, v in props]
        return '{}({})'.format(cname, ', '.join(kwargs))

    def __str__(self) -> str:
        return '{s.left} {s.top} {s.right} {s.bottom}'.format(s=self)

    def __eq__(self, other: typing.Any) -> bool:
        """Equality check"""
        return (
            self.__class__ == other.__class__
            and self.__dict__ == other.__dict__
        )

    def __add__(self, other: typing.Any) -> 'Box':
        """Returns a Box containing both input boxes"""
        try:
            return Box(
                left=min(self.left, other.left),
                top=min(self.top, other.top),
                right=max(self.right, other.right),
                bottom=max(self.bottom, other.bottom),
            )
        except AttributeError:
            return NotImplemented

    def __radd__(self, other: typing.Any) -> 'Box':
        if other == 0:  # default initial value for sum()
            return self
        return self + other

    def __and__(self, other: typing.Any) -> 'Box':
        """Intersection"""
        try:
            return Box(
                left=max(self.left, other.left),
                top=max(self.top, other.top),
                right=min(self.right, other.right),
                bottom=min(self.bottom, other.bottom),
            )
        except ValueError:
            # box of size 0
            return Box(self.left, self.top, self.left, self.top)
        except AttributeError:
            return NotImplemented

    def __mul__(self, factor: float) -> 'Box':
        """Multiply all dimensions by factor"""
        if not isinstance(factor, numbers.Real):
            return NotImplemented
        x, y = self.center
        w, h = self.width * factor, self.height * factor
        return Box(
            left=x - w / 2,
            top=y - h / 2,
            right=x + w / 2,
            bottom=y + h / 2,
        )

    @property
    def width(self) -> float:
        return self.right - self.left

    @width.setter
    def width(self, value: float) -> None:
        self.left, self.right = (
            self.center[0] + x * value * .5 for x in [-1, 1]
        )

    @property
    def height(self) -> float:
        return self.bottom - self.top

    @height.setter
    def height(self, value: float) -> None:
        self.top, self.bottom = (
            self.center[1] + x * value * .5 for x in [-1, 1]
        )

    @property
    def diagonal(self) -> float:
        """Length of diagonal"""
        return (self.width**2 + self.height**2)**0.5

    @property
    def ratio(self) -> float:
        """Aspect ratio"""
        return self.width / self.height

    @property
    def size(self) -> float:
        """Area of Box"""
        return self.width * self.height

    @property
    def center(self) -> typing.Tuple[float, float]:
        """Center point of box (x, y)"""
        return ((self.left + self.right) / 2, (self.top + self.bottom) / 2)

    def serialize(self, precision: int = 4) -> typing.Mapping[str, float]:
        """Build a json serializable dictionary for the box"""

        return dict((a, round(getattr(self, a), precision))
                    for a in self._attrs)


class CropBox(Box):

    _attrs = ['left', 'top', 'bottom', 'right', 'x', 'y']

    def __init__(self, left, top, right, bottom, x, y):

        # truncate overflowing values
        left = max(0.0, left)
        top = max(0.0, top)
        right = min(1.0, right)
        bottom = min(1.0, bottom)

        # make sure values are valid
        left, x, right = sorted([left, left, x, right, right])[1:4]
        top, y, bottom = sorted([top, top, y, bottom, bottom])[1:4]
        self.x, self.y = x, y
        super().__init__(left, top, right, bottom)

    def __str__(self):
        return json.dumps(self.serialize())

    @classmethod
    def basic(cls):
        """ Create a default CropBox """
        return cls(0, 0, 1, 1, 0.5, 0.5)

    def expand(self, h, v=None):
        """ Make box grow or shrink around point of interest """
        if v is None:
            v = h
        if not (-1 <= h <= 1 and -1 <= v <= 1):
            raise ValueError('Values must be between -1 and 1')
        if h >= 0:  # expand x-axis
            left = self.left - self.left * h
            right = self.right + (1 - self.right) * h
        else:  # shrink x-axis
            left = self.left - (self.x - self.left) * h
            right = self.right + (self.right - self.x) * h
        if v >= 0:  # expand y-axis
            top = self.top - self.top * v
            bottom = self.bottom + (1 - self.bottom) * v
        else:  # shrink y-axis
            top = self.top - (self.y - self.top) * v
            bottom = self.bottom + (self.bottom - self.y) * v
        return self.__class__(left, top, right, bottom, self.x, self.y)


def test_box_properties():
    width, height = 7, 11
    box = Box(0, 0, width, height)
    # test getters
    assert box.diagonal == (width**2 + height**2)**0.5
    assert (box.width, box.height) == (width, height)
    assert box.size == width * height
    assert box.ratio == width / height
    assert box.center == (box.left + box.width / 2, box.top + box.height / 2)

    # test setters
    width, height = 35.7, 400.45
    center = box.center
    box.width, box.height = width, height
    assert box.center == center  # unchanged
    assert box.diagonal == (width**2 + height**2)**0.5
    assert (box.width, box.height) == (width, height)
    assert box.size == width * height
    assert box.ratio == width / height


def test_box_operators():

    # eq
    assert Box(0, 1, 2, 3) == Box(0, 1, 2, 3)
    assert Box(0, 1, 2, 3) != Box(0, 0, 2, 3)
    assert Box(0, 1, 2, 3) != object()

    # mul
    assert Box(0, 0, 10, 10) * 2 == Box(-5, -5, 15, 15)
    assert Box(0, 0, 20, 40) * 0.5 == Box(5, 10, 15, 30)

    # add
    assert Box(0, 0, 2, 2) + Box(0, 0, 1, 1) == Box(0, 0, 2, 2)
    assert Box(0, 0, 1, 2) + Box(0, 0, 2, 1) == Box(0, 0, 2, 2)
    assert Box(0, 0, 1, 1) + Box(0, 2, 1, 3) == Box(0, 0, 1, 3)

    # radd
    assert Box(0, 0, 5, 5) == sum([Box(4, 4, 5, 5), Box(0, 0, 1, 1)])

    # and
    assert Box(0, 0, 2, 2) & Box(0, 0, 1, 1) == Box(0, 0, 1, 1)
    assert Box(0, 0, 1, 2) & Box(0, 0, 2, 1) == Box(0, 0, 1, 1)
    assert Box(0, 0, 1, 1) & Box(0, 2, 1, 3) == Box(0, 0, 0, 0)


def test_box_methods():
    box = Box(0, 1, 2, 3)
    # __dict__
    assert box.__dict__ == dict(left=0, top=1, right=2, bottom=3)
    assert box == Box(**box.__dict__)  # pylint: disable-all

    # __iter__
    assert list(box) == [0, 1, 2, 3]
    assert box == Box(*box)

    # __repr__
    assert box == eval(box.__repr__())


def test_box_exceptions():

    with pytest.raises(ValueError):
        Box(0, 1, 1, 0)

    with pytest.raises(TypeError):
        1 + Box(0, 0, 1, 1)
    # does not raise TypeError, which makes sum() work.
    assert 0 + Box(0, 0, 1, 1) == Box(0, 0, 1, 1)
    assert sum([Box(0, 0, 1, 1), Box(2, 2, 3, 3)]) == Box(0, 0, 3, 3)

    with pytest.raises(TypeError):
        Box(0, 0, 1, 1) + 'foo'

    with pytest.raises(TypeError):
        Box(0, 0, 10, 10) * None

    with pytest.raises(TypeError):
        Box(0, 0, 10, 10) & 'abc'

    with pytest.raises(TypeError):
        Box(0, 0, 10, 10) & 2


def test_box_serialize():
    box1 = Box(0, 2, 5, 6)
    data = json.dumps(box1.serialize())
    box2 = Box(**(json.loads(data)))
    assert box1 == box2


def test_cropbox_expansion():
    box = CropBox(.2, .3, .8, .9, .6, .5)
    # no change when expand 0
    assert box == box.expand(0)

    # shrink
    smaller_box = box.expand(-1)
    assert smaller_box == CropBox(.6, .5, .6, .5, .6, .5)
    assert smaller_box.size == 0

    # grow
    larger_box = box.expand(1)
    assert larger_box == CropBox(0, 0, 1, 1, .6, .5)
    assert larger_box.size == 1

    # shrink / grow by half
    smaller_box = box.expand(-0.5)
    assert smaller_box == CropBox(.4, .4, .7, .7, .6, .5)
    larger_box = box.expand(0.5)
    assert larger_box == CropBox(.1, .15, .9, .95, .6, .5)

    # combinations of x and y
    box.expand(-0.5, 0.5) == CropBox(.4, .15, .7, .95, .6, .5)
    box.expand(0, 1) == CropBox(.2, 0, .8, 1, .6, .5)

    with pytest.raises(ValueError):
        box.expand(2)

    with pytest.raises(ValueError):
        box.expand(.3, -3)
