import os
import django
from django.conf import settings
import pytest
from rest_framework.test import APIClient
from auth_app.models import User
from events_app.models import Event, EventLocation, TicketType
from products_app.models import Category, Product

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.test_settings')
TEST_USER_PASS = os.getenv('TEST_USER_PASS', 'test-user-pass')

if not settings.configured:
    django.setup()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email='user@example.com',
        TEST_USER_PASS,
        first_name='Base',
        last_name='User',
    )


@pytest.fixture
def organizer_user(db):
    user = User.objects.create_user(
        email='organizer@example.com',
        TEST_USER_PASS,
        is_organizer=True,
    )
    profile = user.organizer_profile
    profile.company_name = 'Org Inc'
    profile.save(update_fields=['company_name'])
    return user


@pytest.fixture
def category(db):
    return Category.objects.create(name='Merch', slug='merch')


@pytest.fixture
def product(db, category):
    return Product.objects.create(
        title='T-Shirt',
        description='Cotton t-shirt',
        price='20.00',
        category=category,
        stock_quantity=10,
        is_active=True,
    )


@pytest.fixture
def published_event(db, organizer_user):
    location = EventLocation.objects.create(city='Almaty', address='Center')
    event = Event.objects.create(
        organizer=organizer_user.organizer_profile,
        title='Python Meetup',
        description='Meet and talk Python',
        format='offline',
        start_datetime='2026-06-01T10:00:00Z',
        end_datetime='2026-06-01T12:00:00Z',
        is_free=False,
        status='published',
        location=location,
    )
    TicketType.objects.create(
        event=event,
        name='Standard',
        price='15.00',
        quantity_total=100,
    )
    return event
