from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('unit_price', 'total_price')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'items_count', 'created_at', 'updated_at')
    inlines = [CartItemInline]
    readonly_fields = ('created_at', 'updated_at')

    def items_count(self, obj):
        return obj.items.count()
    items_count.short_description = 'Items'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'item_type', 'quantity', 'unit_price', 'total_price')
    list_filter = ('item_type',)
    readonly_fields = ('unit_price',)
