import pytest
from django.db import connection


@pytest.mark.django_db
def test_database_connection():
    """Test that database connection works"""
    assert connection.vendor in {'sqlite', 'postgresql'}


def test_basic_math():
    """Basic sanity test"""
    assert 1 + 1 == 2
