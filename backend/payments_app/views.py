from rest_framework import views, status, permissions
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer, MockChargeSerializer
from orders_app.models import Order

class MockChargeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = MockChargeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order_id = serializer.validated_data['order_id']
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
            
        if order.payment_status == 'paid':
            return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)
            
        order.payment_status = 'paid'
        order.save()
        
        payment = Payment.objects.create(
            order=order,
            amount=order.total,
            status='completed',
            payment_method='mock_card'
        )
        
        return Response(PaymentSerializer(payment).data, status=status.HTTP_200_OK)
