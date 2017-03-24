from ..setting_helpers import Environment, joinpath
import pytest
import os


def test_path():
    base_dir = joinpath()
    # base dir is a parent of this file
    assert __file__.startswith(base_dir)
    items = __file__.replace(base_dir, '').split('/')

    assert joinpath(*items) == __file__
    assert joinpath('foo', 'bar') == base_dir + '/foo/bar'
    assert joinpath('foo/bar') == base_dir + '/foo/bar'
    assert joinpath('foo///bar') == base_dir + '/foo/bar'

    # `resolve` keyword
    assert joinpath('universitas', resolve=True) == base_dir + '/universitas'

    with pytest.raises(OSError):
        joinpath('this/dont/exist', resolve=True)


def test_environ_prefix():
    os.environ.setdefault('FOOBAR_FOO', 'foo')
    os.environ.setdefault('FOOBAR', 'foobar')

    foo = Environment('FOOBAR')

    assert foo.foo == os.environ['FOOBAR_FOO']

    # exact prefix returns itself
    assert foo.foobar == os.environ['FOOBAR']

    with pytest.raises(AttributeError):
        foo.doesntexist


def test_nonstrict_environ():

    E = Environment(strict=False)

    assert E.user == os.environ['USER']
    assert E.path == os.environ['PATH']
    assert E.doesntexist == ''
