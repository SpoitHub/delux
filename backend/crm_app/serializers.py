from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomerNote
from orders_app.serializers import OrderSerializer

User = get_user_model()

class CustomerNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerNote
        fields = ['id', 'note_text', 'created_at']

class CustomerSerializer(serializers.ModelSerializer):
    orders_count = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    last_order_date = serializers.DateTimeField(read_only=True)
    notes = serializers.SerializerMethodField()
    orders = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'orders_count', 'total_spent', 'last_order_date', 'notes', 'orders']

    def get_notes(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return []
            
        if request.user.is_superuser:
            notes = CustomerNote.objects.filter(customer=obj).order_by('-created_at')
        else:
            organizer = getattr(request.user, 'organizerprofile', None)
            notes = CustomerNote.objects.filter(customer=obj, organizer=organizer).order_by('-created_at')
        return CustomerNoteSerializer(notes, many=True).data

    def get_orders(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return []

        from orders_app.models import Order
        if request.user.is_superuser:
            orders = Order.objects.filter(user=obj).distinct()
        else:
            organizer = getattr(request.user, 'organizerprofile', None)
            orders = Order.objects.filter(user=obj, items__ticket_type__event__organizer=organizer).distinct()
            
        return OrderSerializer(orders, many=True).data

class DashboardStatSerializer(serializers.Serializer):
    events_count = serializers.IntegerField()
    orders_count = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    customers_count = serializers.IntegerField()
