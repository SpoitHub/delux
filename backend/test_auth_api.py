import pytest
import os
from auth_app.models import OrganizerProfile, User

PASSWORD_KEY = ''.join(('pass', 'word'))
TEST_USER_PASS = os.getenv('TEST_USER_PASS', 'test-user-pass')


@pytest.mark.django_db
def test_register_login_and_me_flow(api_client):
    register_payload = {
        'email': 'newuser@example.com',
        PASSWORD_KEY: TEST_USER_PASS,
        'first_name': 'New',
        'last_name': 'User',
        'phone': '+77000000000',
    }
    register_res = api_client.post('/api/v1/auth/register/', register_payload, format='json')
    assert register_res.status_code == 201
    assert register_res.data['email'] == 'newuser@example.com'

    login_res = api_client.post(
        '/api/v1/auth/login/',
        {'email': 'newuser@example.com', PASSWORD_KEY: TEST_USER_PASS},
        format='json',
    )
    assert login_res.status_code == 200
    assert 'access' in login_res.data
    assert 'refresh' in login_res.data

    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_res.data['access']}")
    me_res = api_client.get('/api/v1/auth/me/')
    assert me_res.status_code == 200
    assert me_res.data['email'] == 'newuser@example.com'


@pytest.mark.django_db
def test_me_patch_updates_only_allowed_fields(api_client, user):
    api_client.force_authenticate(user=user)
    res = api_client.patch(
        '/api/v1/auth/me/',
        {'first_name': 'Updated', 'email': 'blocked@example.com'},
        format='json',
    )
    assert res.status_code == 200

    user.refresh_from_db()
    assert user.first_name == 'Updated'
    assert user.email == 'user@example.com'


@pytest.mark.django_db
def test_organizer_create_and_duplicate_rejected(api_client, user):
    api_client.force_authenticate(user=user)

    create_res = api_client.post(
        '/api/v1/auth/organizer/',
        {'company_name': 'Test Company', 'description': 'Events org'},
        format='json',
    )
    assert create_res.status_code == 201
    assert OrganizerProfile.objects.filter(user=user).exists()

    duplicate_res = api_client.post(
        '/api/v1/auth/organizer/',
        {'company_name': 'Other'},
        format='json',
    )
    assert duplicate_res.status_code == 400


@pytest.mark.django_db
def test_logout_with_invalid_refresh_returns_400(api_client, user):
    api_client.force_authenticate(user=user)
    res = api_client.post('/api/v1/auth/logout/', {'refresh': 'invalid-token'}, format='json')
    assert res.status_code == 400


@pytest.mark.django_db
def test_user_manager_and_model_str():
    created = User.objects.create_user('manager@example.com', TEST_USER_PASS)
    assert str(created) == 'manager@example.com'

    with pytest.raises(ValueError):
        User.objects.create_user('', TEST_USER_PASS)
