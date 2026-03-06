from rest_framework import generics, views, status, permissions
from rest_framework.response import Response
from django.db.models import Count, Sum, Max, Q
from django.contrib.auth import get_user_model
from .models import CustomerNote
from .serializers import CustomerNoteSerializer, CustomerSerializer, DashboardStatSerializer
from orders_app.models import Order
from events_app.models import Event
from .permissions import IsOrganizer
from orders_app.serializers import OrderSerializer

User = get_user_model()

class DashboardView(views.APIView):
    permission_classes = [IsOrganizer]

    def get(self, request, *args, **kwargs):
        organizer = request.user.organizerprofile
        
        events_count = Event.objects.filter(organizer=organizer).count()
        orders = Order.objects.filter(items__ticket_type__event__organizer=organizer).distinct()
        orders_count = orders.count()
        
        from orders_app.models import OrderItem
        revenue = OrderItem.objects.filter(
            order__in=orders, 
            ticket_type__event__organizer=organizer
        ).aggregate(total=Sum('total_price'))['total'] or 0.00
        
        customers_count = User.objects.filter(orders__in=orders).distinct().count()

        data = {
            "events_count": events_count,
            "orders_count": orders_count,
            "revenue": revenue,
            "customers_count": customers_count
        }
        
        serializer = DashboardStatSerializer(data)
        return Response(serializer.data)


class CrmOrderListView(generics.ListAPIView):
    permission_classes = [IsOrganizer]
    serializer_class = OrderSerializer

    def get_queryset(self):
        organizer = self.request.user.organizerprofile
        qs = Order.objects.filter(items__ticket_type__event__organizer=organizer).distinct()
        
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
            
        payment_status = self.request.query_params.get('payment_status')
        if payment_status:
            qs = qs.filter(payment_status=payment_status)
            
        return qs.order_by('-created_at')

class CrmOrderDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOrganizer]
    serializer_class = OrderSerializer

    def get_queryset(self):
        organizer = self.request.user.organizerprofile
        return Order.objects.filter(items__ticket_type__event__organizer=organizer).distinct()

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

class CrmOrderRefundView(views.APIView):
    permission_classes = [IsOrganizer]

    def post(self, request, pk, *args, **kwargs):
        organizer = request.user.organizerprofile
        try:
            order = Order.objects.get(pk=pk, items__ticket_type__event__organizer=organizer)
        except Order.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        
        order.payment_status = 'refunded'
        order.save()
        return Response({'status': 'refunded', 'amount': str(order.total)})

class CustomerListView(generics.ListAPIView):
    permission_classes = [IsOrganizer]
    serializer_class = CustomerSerializer

    def get_queryset(self):
        organizer = self.request.user.organizerprofile
        orders = Order.objects.filter(items__ticket_type__event__organizer=organizer)
        
        qs = User.objects.filter(orders__in=orders).distinct()
        qs = qs.annotate(
            orders_count=Count('orders', filter=Q(orders__in=orders), distinct=True),
            total_spent=Sum('orders__items__total_price', filter=Q(orders__items__ticket_type__event__organizer=organizer)),
            last_order_date=Max('orders__created_at', filter=Q(orders__in=orders))
        )
        return qs

class CustomerDetailView(generics.RetrieveAPIView):
    permission_classes = [IsOrganizer]
    serializer_class = CustomerSerializer

    def get_queryset(self):
        organizer = self.request.user.organizerprofile
        orders = Order.objects.filter(items__ticket_type__event__organizer=organizer)
        
        qs = User.objects.filter(orders__in=orders).distinct()
        qs = qs.annotate(
            orders_count=Count('orders', filter=Q(orders__in=orders), distinct=True),
            total_spent=Sum('orders__items__total_price', filter=Q(orders__items__ticket_type__event__organizer=organizer)),
            last_order_date=Max('orders__created_at', filter=Q(orders__in=orders))
        )
        return qs

class CustomerNoteCreateView(generics.CreateAPIView):
    permission_classes = [IsOrganizer]
    serializer_class = CustomerNoteSerializer

    def perform_create(self, serializer):
        organizer = self.request.user.organizerprofile
        user_id = self.kwargs['userId']
        customer = User.objects.get(pk=user_id)
        serializer.save(organizer=organizer, customer=customer)
