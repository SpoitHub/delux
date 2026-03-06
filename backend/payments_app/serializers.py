from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'amount', 'status', 'payment_method', 'created_at']

class MockChargeSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
