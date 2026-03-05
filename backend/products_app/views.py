from django.db.models import Q
from django.utils.text import slugify
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from events_app.views import IsOrganizer
from .models import Category, Product, ProductImage
from .serializers import (
    CategorySerializer, ProductSerializer,
    ProductWriteSerializer, ProductImageSerializer,
)


# ─── Public Views ─────────────────────────────────────────────────────────────

class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        return Response(CategorySerializer(categories, many=True).data)


class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from rest_framework.pagination import PageNumberPagination

        qs = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')

        search = request.query_params.get('search')
        category = request.query_params.get('category')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')

        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
        if category:
            qs = qs.filter(
                Q(category__slug__iexact=category) | Q(category__name__icontains=category)
            )
        if min_price:
            try:
                qs = qs.filter(price__gte=float(min_price))
            except ValueError:
                pass
        if max_price:
            try:
                qs = qs.filter(price__lte=float(max_price))
            except ValueError:
                pass

        paginator = PageNumberPagination()
        paginator.page_size = 12
        page = paginator.paginate_queryset(qs, request)
        serializer = ProductSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            product = (
                Product.objects.filter(is_active=True)
                .select_related('category')
                .prefetch_related('images')
                .get(pk=pk)
            )
        except Product.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProductSerializer(product, context={'request': request}).data)


# ─── CRM Views ────────────────────────────────────────────────────────────────

class CrmCategoryListCreateView(APIView):
    """GET all categories / POST to create one."""
    permission_classes = [IsOrganizer]

    def get(self, request):
        categories = Category.objects.all()
        return Response(CategorySerializer(categories, many=True).data)

    def post(self, request):
        name = (request.data.get('name') or '').strip()
        if not name:
            return Response({'detail': 'name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Auto-generate unique slug
        base_slug = slugify(name)
        slug = base_slug
        counter = 1
        while Category.objects.filter(slug=slug).exists():
            slug = f'{base_slug}-{counter}'
            counter += 1

        category = Category.objects.create(name=name, slug=slug)
        return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)


class CrmProductListCreateView(APIView):
    permission_classes = [IsOrganizer]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        qs = Product.objects.all().select_related('category').prefetch_related('images')
        return Response(ProductSerializer(qs, many=True, context={'request': request}).data)

    def post(self, request):
        serializer = ProductWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # Attach an image if provided
        image_file = request.FILES.get('image')
        if image_file:
            ProductImage.objects.create(product=product, image=image_file, is_primary=True)

        product.refresh_from_db()
        return Response(
            ProductSerializer(
                Product.objects.select_related('category').prefetch_related('images').get(pk=product.pk),
                context={'request': request},
            ).data,
            status=status.HTTP_201_CREATED,
        )


class CrmProductDetailView(APIView):
    permission_classes = [IsOrganizer]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def _get_product(self, pk):
        try:
            return (
                Product.objects.select_related('category')
                .prefetch_related('images')
                .get(pk=pk)
            )
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        product = self._get_product(pk)
        if not product:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProductSerializer(product, context={'request': request}).data)

    def patch(self, request, pk):
        product = self._get_product(pk)
        if not product:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductWriteSerializer(product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # Replace primary image if a new one is uploaded
        image_file = request.FILES.get('image')
        if image_file:
            product.images.all().delete()
            ProductImage.objects.create(product=product, image=image_file, is_primary=True)

        return Response(
            ProductSerializer(
                Product.objects.select_related('category').prefetch_related('images').get(pk=product.pk),
                context={'request': request},
            ).data
        )

    def delete(self, request, pk):
        product = self._get_product(pk)
        if not product:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CrmProductImageView(APIView):
    """POST /crm/products/{pk}/images/ — upload additional images."""
    permission_classes = [IsOrganizer]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            product = Product.objects.prefetch_related('images').get(pk=pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'detail': 'image is required.'}, status=status.HTTP_400_BAD_REQUEST)

        is_primary_raw = request.data.get('is_primary', 'false')
        is_primary = str(is_primary_raw).lower() in ('true', '1', 'yes')

        if is_primary:
            product.images.all().update(is_primary=False)

        img = ProductImage.objects.create(product=product, image=image_file, is_primary=is_primary)
        return Response(
            ProductImageSerializer(img, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )
