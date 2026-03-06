from django.db import models
from django.conf import settings


class ShippingAddress(models.Model):
    city = models.CharField(max_length=255)
    address_line = models.CharField(max_length=500)
    postal_code = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.city}, {self.address_line}"


class OrderContact(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    DELIVERY_TYPE_CHOICES = [
        ('none', 'None'),
        ('pickup', 'Pickup'),
        ('delivery', 'Delivery'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default='pending')
    delivery_type = models.CharField(max_length=50, choices=DELIVERY_TYPE_CHOICES, default='none')
    
    contact = models.OneToOneField(OrderContact, on_delete=models.CASCADE)
    shipping_address = models.OneToOneField(ShippingAddress, on_delete=models.CASCADE, null=True, blank=True)
    
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} by {self.user}"


class OrderItem(models.Model):
    ITEM_TYPE_CHOICES = [
        ('product', 'Product'),
        ('ticket', 'Ticket'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES)
    product = models.ForeignKey(
        'products_app.Product',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='order_items',
    )
    ticket_type = models.ForeignKey(
        'events_app.TicketType',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='order_items',
    )
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"OrderItem {self.item_type} (Order #{self.order_id})"
