import pytest
from events_app.models import Event
from products_app.models import Category, Product


@pytest.mark.django_db
def test_public_events_list_detail_and_tickets(api_client, published_event):
    list_res = api_client.get('/api/v1/events/?search=python&city=alma&is_free=false')
    assert list_res.status_code == 200
    assert list_res.data['count'] == 1
    assert list_res.data['results'][0]['id'] == published_event.id

    detail_res = api_client.get(f'/api/v1/events/{published_event.id}/')
    assert detail_res.status_code == 200
    assert detail_res.data['title'] == published_event.title

    tickets_res = api_client.get(f'/api/v1/events/{published_event.id}/tickets/')
    assert tickets_res.status_code == 200
    assert len(tickets_res.data) == 1


@pytest.mark.django_db
def test_event_detail_returns_404_for_unpublished(api_client, organizer_user):
    draft_event = Event.objects.create(
        organizer=organizer_user.organizer_profile,
        title='Draft Event',
        description='Not public',
        format='offline',
        start_datetime='2026-07-01T10:00:00Z',
        end_datetime='2026-07-01T12:00:00Z',
        status='draft',
    )

    res = api_client.get(f'/api/v1/events/{draft_event.id}/')
    assert res.status_code == 404


@pytest.mark.django_db
def test_crm_event_create_patch_publish_unpublish(api_client, organizer_user):
    api_client.force_authenticate(user=organizer_user)

    create_payload = {
        'title': 'New Event',
        'description': 'Description',
        'format': 'offline',
        'start_datetime': '2026-07-10T09:00:00Z',
        'end_datetime': '2026-07-10T11:00:00Z',
        'is_free': False,
        'status': 'draft',
        'location': {'city': 'Astana', 'address': 'Street 1'},
        'ticket_types': [{'name': 'VIP', 'price': '30.00', 'quantity_total': 50}],
    }
    create_res = api_client.post('/api/v1/crm/events/', create_payload, format='json')
    assert create_res.status_code == 201
    event_id = create_res.data['id']

    patch_payload = {
        'title': 'New Event Updated',
        'location': {'city': 'Astana', 'address': 'Street 2'},
        'ticket_types': [{'name': 'Regular', 'price': '10.00', 'quantity_total': 200}],
    }
    patch_res = api_client.patch(f'/api/v1/crm/events/{event_id}/', patch_payload, format='json')
    assert patch_res.status_code == 200
    assert patch_res.data['title'] == 'New Event Updated'
    assert len(patch_res.data['ticket_types']) == 1

    publish_res = api_client.post(f'/api/v1/crm/events/{event_id}/publish/', {}, format='json')
    assert publish_res.status_code == 200
    assert publish_res.data['status'] == 'published'

    unpublish_res = api_client.post(f'/api/v1/crm/events/{event_id}/unpublish/', {}, format='json')
    assert unpublish_res.status_code == 200
    assert unpublish_res.data['status'] == 'draft'


@pytest.mark.django_db
def test_crm_event_for_non_organizer_forbidden(api_client, user):
    api_client.force_authenticate(user=user)
    res = api_client.get('/api/v1/crm/events/')
    assert res.status_code == 403


@pytest.mark.django_db
def test_products_public_and_crm_category_slug(api_client, organizer_user):
    cat = Category.objects.create(name='Books', slug='books')
    Product.objects.create(
        title='Python Book',
        description='Learn Python',
        price='35.00',
        category=cat,
        stock_quantity=15,
        is_active=True,
    )
    Product.objects.create(
        title='Inactive',
        description='Nope',
        price='99.00',
        category=cat,
        stock_quantity=1,
        is_active=False,
    )

    public_res = api_client.get('/api/v1/products/?search=python&category=books&min_price=10&max_price=40')
    assert public_res.status_code == 200
    assert public_res.data['count'] == 1

    api_client.force_authenticate(user=organizer_user)
    create_cat_1 = api_client.post('/api/v1/crm/products/categories/', {'name': 'Tech'}, format='json')
    assert create_cat_1.status_code == 201
    assert create_cat_1.data['slug'] == 'tech'

    create_cat_2 = api_client.post('/api/v1/crm/products/categories/', {'name': 'Tech'}, format='json')
    assert create_cat_2.status_code == 201
    assert create_cat_2.data['slug'].startswith('tech-')


@pytest.mark.django_db
def test_crm_product_create_patch_delete(api_client, organizer_user, category):
    api_client.force_authenticate(user=organizer_user)

    create_res = api_client.post(
        '/api/v1/crm/products/',
        {
            'title': 'Cap',
            'description': 'Stylish cap',
            'price': '12.50',
            'category_id': category.id,
            'stock_quantity': 5,
            'is_active': True,
        },
        format='json',
    )
    assert create_res.status_code == 201
    product_id = create_res.data['id']

    patch_res = api_client.patch(
        f'/api/v1/crm/products/{product_id}/',
        {'stock_quantity': 20},
        format='json',
    )
    assert patch_res.status_code == 200
    assert patch_res.data['stock_quantity'] == 20

    delete_res = api_client.delete(f'/api/v1/crm/products/{product_id}/')
    assert delete_res.status_code == 204
