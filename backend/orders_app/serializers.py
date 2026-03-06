from rest_framework import serializers
from .models import Order, OrderItem, ShippingAddress, OrderContact
from cart_app.models import Cart
from decimal import Decimal

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['city', 'address_line', 'postal_code']

class OrderContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderContact
        fields = ['name', 'phone']

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    ticket_type = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'item_type', 'product', 'ticket_type', 'quantity', 'unit_price', 'total_price']

    def get_product(self, obj):
        if obj.item_type == 'product' and obj.product:
            # Returning minimal info, adjust based on actual ProductSerializer if needed
            images = []
            if getattr(obj.product, 'productimage_set', None):
                main_image = obj.product.productimage_set.filter(is_primary=True).first()
                if main_image and main_image.image:
                    images.append({'image': main_image.image.url, 'is_primary': True})
            return {
                'id': obj.product.id,
                'title': obj.product.title,
                'price': str(obj.product.price),
                'images': images
            }
        return None

    def get_ticket_type(self, obj):
        if obj.item_type == 'ticket' and obj.ticket_type:
            return {
                'id': obj.ticket_type.id,
                'name': obj.ticket_type.name,
                'price': str(obj.ticket_type.price)
            }
        return None

class OrderSerializer(serializers.ModelSerializer):
    contact = OrderContactSerializer(read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'payment_status', 'delivery_type',
            'contact', 'shipping_address', 'items', 'total',
            'created_at', 'updated_at'
        ]

class OrderCreateSerializer(serializers.Serializer):
    delivery_type = serializers.ChoiceField(choices=Order.DELIVERY_TYPE_CHOICES)
    contact = OrderContactSerializer()
    shipping_address = ShippingAddressSerializer(required=False, allow_null=True)

    def validate(self, attrs):
        delivery_type = attrs.get('delivery_type')
        shipping_address = attrs.get('shipping_address')

        if delivery_type == 'delivery' and not shipping_address:
            raise serializers.ValidationError({"shipping_address": "Shipping address is required for delivery type 'delivery'."})

        request = self.context.get('request')
        cart_exists = Cart.objects.filter(user=request.user).exists()
        if not cart_exists:
            raise serializers.ValidationError({"cart": "Cart not found."})
            
        cart = Cart.objects.get(user=request.user)
        if cart.items.count() == 0:
            raise serializers.ValidationError({"cart": "Cart is empty."})
            
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        cart = Cart.objects.get(user=user)
        
        contact_data = validated_data.pop('contact')
        contact = OrderContact.objects.create(**contact_data)
        
        shipping_data = validated_data.pop('shipping_address', None)
        shipping_address = None
        if shipping_data:
            shipping_address = ShippingAddress.objects.create(**shipping_data)
        
        order = Order.objects.create(
            user=user,
            delivery_type=validated_data['delivery_type'],
            contact=contact,
            shipping_address=shipping_address,
            status='confirmed',  # Based on MVP specs
            payment_status='pending'
        )
        
        total = Decimal('0.00')
        for cart_item in cart.items.all():
            total_price = cart_item.total_price  # unit_price * quantity
            OrderItem.objects.create(
                order=order,
                item_type=cart_item.item_type,
                product=cart_item.product,
                ticket_type=cart_item.ticket_type,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
                total_price=total_price
            )
            total += total_price
            
            # Stock management (Optional/Recommended):
            if cart_item.item_type == 'product' and cart_item.product:
                product = cart_item.product
                if product.stock_quantity >= cart_item.quantity:
                    product.stock_quantity -= cart_item.quantity
                    product.save()
            elif cart_item.item_type == 'ticket' and cart_item.ticket_type:
                ticket_type = cart_item.ticket_type
                if ticket_type.quantity_total - ticket_type.quantity_sold >= cart_item.quantity:
                    ticket_type.quantity_sold += cart_item.quantity
                    ticket_type.save()
        
        order.total = total
        order.save()
        
        cart.items.all().delete()
        
        return order
