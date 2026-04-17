import pytest


@pytest.mark.django_db
def test_database_connection():
    """Test that database connection works"""
    assert True


def test_basic_math():
    """Basic sanity test"""
    assert 1 + 1 == 2
