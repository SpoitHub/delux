from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    CartItemWriteSerializer,
    CartItemQuantitySerializer,
)


class CartView(APIView):
    """GET /cart/ — get (or create) the current user's cart."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class CartItemCreateView(APIView):
    """POST /cart/items/ — add a product or ticket to the cart."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ser = CartItemWriteSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        cart, _ = Cart.objects.get_or_create(user=request.user)
        item_type = data['item_type']
        quantity = data['quantity']

        if item_type == 'product':
            from products_app.models import Product
            try:
                product = Product.objects.get(pk=data['product_id'], is_active=True)
            except Product.DoesNotExist:
                return Response({'detail': 'Product not found.'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if already in cart — merge quantities
            existing = cart.items.filter(item_type='product', product=product).first()
            new_qty = (existing.quantity if existing else 0) + quantity

            if product.stock_quantity < new_qty:
                return Response(
                    {'detail': f'Only {product.stock_quantity} in stock.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if existing:
                existing.quantity = new_qty
                existing.save()
                item = existing
            else:
                item = CartItem.objects.create(
                    cart=cart,
                    item_type='product',
                    product=product,
                    quantity=quantity,
                    unit_price=product.price,
                )

        else:  # ticket
            from events_app.models import TicketType
            try:
                ticket_type = TicketType.objects.select_related('event').get(pk=data['ticket_type_id'])
            except TicketType.DoesNotExist:
                return Response({'detail': 'Ticket type not found.'}, status=status.HTTP_400_BAD_REQUEST)

            available = ticket_type.quantity_total - ticket_type.quantity_sold
            existing = cart.items.filter(item_type='ticket', ticket_type=ticket_type).first()
            new_qty = (existing.quantity if existing else 0) + quantity

            if available < new_qty:
                return Response(
                    {'detail': f'Only {available} tickets available.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if existing:
                existing.quantity = new_qty
                existing.save()
                item = existing
            else:
                item = CartItem.objects.create(
                    cart=cart,
                    item_type='ticket',
                    ticket_type=ticket_type,
                    quantity=quantity,
                    unit_price=ticket_type.price,
                )

        return Response(
            CartItemSerializer(item, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class CartItemDetailView(APIView):
    """PATCH /cart/items/{id}/ — update quantity.
       DELETE /cart/items/{id}/ — remove item."""
    permission_classes = [IsAuthenticated]

    def _get_item(self, request, pk):
        try:
            return CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return None

    def patch(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        ser = CartItemQuantitySerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        new_qty = ser.validated_data['quantity']

        # Validate stock / availability
        if item.item_type == 'product' and item.product:
            if item.product.stock_quantity < new_qty:
                return Response(
                    {'detail': f'Only {item.product.stock_quantity} in stock.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        elif item.item_type == 'ticket' and item.ticket_type:
            available = item.ticket_type.quantity_total - item.ticket_type.quantity_sold
            if available < new_qty:
                return Response(
                    {'detail': f'Only {available} tickets available.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        item.quantity = new_qty
        item.save()
        return Response(CartItemSerializer(item, context={'request': request}).data)

    def delete(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartClearView(APIView):
    """POST /cart/clear/ — delete all items from the cart."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
