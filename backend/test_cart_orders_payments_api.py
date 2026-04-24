import pytest
from cart_app.models import Cart
from events_app.models import TicketType
from orders_app.models import Order


@pytest.mark.django_db
def test_cart_get_add_patch_delete_clear(api_client, user, product):
    api_client.force_authenticate(user=user)

    cart_res = api_client.get('/api/v1/cart/')
    assert cart_res.status_code == 200
    assert cart_res.data['items_count'] == 0

    add_res = api_client.post(
        '/api/v1/cart/items/',
        {'item_type': 'product', 'product_id': product.id, 'quantity': 2},
        format='json',
    )
    assert add_res.status_code == 201
    item_id = add_res.data['id']

    add_same_res = api_client.post(
        '/api/v1/cart/items/',
        {'item_type': 'product', 'product_id': product.id, 'quantity': 1},
        format='json',
    )
    assert add_same_res.status_code == 201
    assert add_same_res.data['quantity'] == 3

    overstock_patch = api_client.patch(f'/api/v1/cart/items/{item_id}/', {'quantity': 999}, format='json')
    assert overstock_patch.status_code == 400

    patch_res = api_client.patch(f'/api/v1/cart/items/{item_id}/', {'quantity': 4}, format='json')
    assert patch_res.status_code == 200
    assert patch_res.data['quantity'] == 4

    delete_res = api_client.delete(f'/api/v1/cart/items/{item_id}/')
    assert delete_res.status_code == 204

    api_client.post(
        '/api/v1/cart/items/',
        {'item_type': 'product', 'product_id': product.id, 'quantity': 1},
        format='json',
    )
    clear_res = api_client.post('/api/v1/cart/clear/', {}, format='json')
    assert clear_res.status_code == 204
    assert Cart.objects.get(user=user).items.count() == 0


@pytest.mark.django_db
def test_cart_ticket_flow_and_availability(api_client, user, published_event):
    ticket = TicketType.objects.get(event=published_event)
    api_client.force_authenticate(user=user)

    add_res = api_client.post(
        '/api/v1/cart/items/',
        {'item_type': 'ticket', 'ticket_type_id': ticket.id, 'quantity': 3},
        format='json',
    )
    assert add_res.status_code == 201

    too_many_res = api_client.post(
        '/api/v1/cart/items/',
        {'item_type': 'ticket', 'ticket_type_id': ticket.id, 'quantity': 200},
        format='json',
    )
    assert too_many_res.status_code == 400


@pytest.mark.django_db
def test_order_creation_from_cart_updates_inventory_and_clears_cart(api_client, user, product):
    api_client.force_authenticate(user=user)

    add_res = api_client.post(
        '/api/v1/cart/items/',
        {'item_type': 'product', 'product_id': product.id, 'quantity': 2},
        format='json',
    )
    assert add_res.status_code == 201

    create_order_res = api_client.post(
        '/api/v1/orders/',
        {
            'delivery_type': 'delivery',
            'contact': {'name': 'John Doe', 'phone': '+77001234567'},
            'shipping_address': {
                'city': 'Almaty',
                'address_line': 'Main 1',
                'postal_code': '050000',
            },
        },
        format='json',
    )
    assert create_order_res.status_code == 201
    order_id = create_order_res.data['id']
    assert create_order_res.data['status'] == 'confirmed'

    product.refresh_from_db()
    assert product.stock_quantity == 8
    assert Cart.objects.get(user=user).items.count() == 0

    list_res = api_client.get('/api/v1/orders/')
    assert list_res.status_code == 200
    assert len(list_res.data) == 1

    detail_res = api_client.get(f'/api/v1/orders/{order_id}/')
    assert detail_res.status_code == 200


@pytest.mark.django_db
def test_order_creation_requires_shipping_for_delivery(api_client, user, product):
    api_client.force_authenticate(user=user)
    api_client.post(
        '/api/v1/cart/items/',
        {'item_type': 'product', 'product_id': product.id, 'quantity': 1},
        format='json',
    )

    res = api_client.post(
        '/api/v1/orders/',
        {
            'delivery_type': 'delivery',
            'contact': {'name': 'John Doe', 'phone': '+77001234567'},
        },
        format='json',
    )
    assert res.status_code == 400
    assert 'shipping_address' in res.data


@pytest.mark.django_db
def test_mock_charge_marks_order_paid(api_client, user, product):
    api_client.force_authenticate(user=user)
    api_client.post(
        '/api/v1/cart/items/',
        {'item_type': 'product', 'product_id': product.id, 'quantity': 1},
        format='json',
    )

    order_res = api_client.post(
        '/api/v1/orders/',
        {
            'delivery_type': 'pickup',
            'contact': {'name': 'John Doe', 'phone': '+77001234567'},
        },
        format='json',
    )
    assert order_res.status_code == 201
    order_id = order_res.data['id']

    pay_res = api_client.post('/api/v1/payments/mock/charge/', {'order_id': order_id}, format='json')
    assert pay_res.status_code == 200
    assert pay_res.data['status'] == 'completed'

    already_paid_res = api_client.post('/api/v1/payments/mock/charge/', {'order_id': order_id}, format='json')
    assert already_paid_res.status_code == 400

    order = Order.objects.get(id=order_id)
    assert order.payment_status == 'paid'
