from django.db import models
from django.conf import settings


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart(user={self.user_id})"


class CartItem(models.Model):
    ITEM_TYPE_CHOICES = [
        ('product', 'Product'),
        ('ticket',  'Ticket'),
    ]

    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES)
    product = models.ForeignKey(
        'products_app.Product',
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='cart_items',
    )
    ticket_type = models.ForeignKey(
        'events_app.TicketType',
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='cart_items',
    )
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    @property
    def total_price(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"CartItem({self.item_type}, qty={self.quantity}, cart={self.cart_id})"
