from rest_framework import serializers
from .models import Cart, CartItem


# ── Nested mini-serializers ──────────────────────────────────────────────

class CartProductImageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    image = serializers.SerializerMethodField()
    is_primary = serializers.BooleanField()

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class CartProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    images = CartProductImageSerializer(many=True, read_only=True)


class CartTicketTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    price = serializers.DecimalField(max_digits=12, decimal_places=2)


class CartEventSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    start_datetime = serializers.DateTimeField()
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


# ── CartItem read serializer ─────────────────────────────────────────────

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    ticket_type = serializers.SerializerMethodField()
    event = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'item_type',
            'product', 'ticket_type', 'event',
            'quantity', 'unit_price', 'total_price',
        ]

    def get_product(self, obj):
        if obj.item_type == 'product' and obj.product:
            return CartProductSerializer(obj.product, context=self.context).data
        return None

    def get_ticket_type(self, obj):
        if obj.item_type == 'ticket' and obj.ticket_type:
            return CartTicketTypeSerializer(obj.ticket_type).data
        return None

    def get_event(self, obj):
        if obj.item_type == 'ticket' and obj.ticket_type:
            return CartEventSerializer(obj.ticket_type.event, context=self.context).data
        return None

    def get_total_price(self, obj):
        return str(obj.total_price)


# ── Cart read serializer ─────────────────────────────────────────────────

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'items_count', 'total']

    def get_items_count(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_total(self, obj):
        total = sum(item.total_price for item in obj.items.all())
        return str(total)


# ── CartItem write serializer ────────────────────────────────────────────

class CartItemWriteSerializer(serializers.Serializer):
    item_type = serializers.ChoiceField(choices=['product', 'ticket'])
    product_id = serializers.IntegerField(required=False, allow_null=True)
    ticket_type_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1)

    def validate(self, data):
        item_type = data.get('item_type')
        if item_type == 'product' and not data.get('product_id'):
            raise serializers.ValidationError("product_id is required for item_type='product'.")
        if item_type == 'ticket' and not data.get('ticket_type_id'):
            raise serializers.ValidationError("ticket_type_id is required for item_type='ticket'.")
        return data


class CartItemQuantitySerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
