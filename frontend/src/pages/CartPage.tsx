import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Calendar, Ticket } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '../features/cart/hooks';
import { formatPrice } from '../shared/lib/formatters';
import { PageSpinner } from '../shared/ui/Spinner';
import { EmptyState } from '../shared/ui/EmptyState';
import { useToast } from '../shared/ui/toast-context';

export const CartPage = () => {
  const { data: cart, isLoading, isError } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCartMutation = useClearCart();
  const { toast } = useToast();

  if (isLoading) return <PageSpinner />;

  if (isError) {
    return (
      <EmptyState
        title="Loading Error"
        description="Could not load cart. Please try again later."
      />
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="pb-24">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-12">
          <span className="text-white block">YOUR</span>
          <span className="text-[#39ff14] block">CART</span>
        </h1>
        <EmptyState
          icon={<ShoppingBag size={28} className="text-gray-500" />}
          title="Cart is Empty"
          description="Add event tickets or products from the shop"
          actionLabel="Go to Shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  const handleQuantityChange = (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    updateItem.mutate(
      { itemId, quantity: newQty },
      { onError: () => toast('Failed to update quantity', 'error') }
    );
  };

  const handleRemove = (itemId: number) => {
    removeItem.mutate(itemId, {
      onSuccess: () => toast('Item removed from cart', 'info'),
      onError: () => toast('Failed to remove item', 'error'),
    });
  };

  const handleClearCart = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => toast('Cart cleared', 'info'),
      onError: () => toast('Failed to clear cart', 'error'),
    });
  };

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
          <span className="text-white block">YOUR</span>
          <span className="text-[#39ff14] block">CART</span>
        </h1>
        <button
          onClick={handleClearCart}
          disabled={clearCartMutation.isPending}
          className="text-gray-400 hover:text-red-400 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2"
        >
          <Trash2 size={14} />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const isTicket = item.item_type === 'ticket';
            const name = isTicket
              ? `${item.event?.title ?? 'Event'} — ${item.ticket_type?.name ?? 'Ticket'}`
              : item.product?.title ?? 'Product';
            const image = isTicket
              ? item.event?.image
              : item.product?.images?.[0]?.image;
            const fallbackIcon = isTicket
              ? <Ticket size={24} className="text-white/20" />
              : <ShoppingBag size={24} className="text-white/20" />;

            return (
              <div
                key={item.id}
                className="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-6 flex gap-4 md:gap-6 hover:border-white/10 transition-colors"
              >
                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center">
                  {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                  ) : fallbackIcon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 flex items-center gap-1 mb-1">
                        {isTicket ? (
                          <>
                            <Calendar size={10} />
                            Ticket
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={10} />
                            Product
                          </>
                        )}
                      </span>
                      <h3 className="text-white font-bold truncate">{name}</h3>
                      <p className="text-[#39ff14] font-bold text-sm mt-1">
                        {formatPrice(item.unit_price)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={removeItem.isPending}
                      className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-white/5 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updateItem.isPending}
                        className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-white font-bold text-sm min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={updateItem.isPending}
                        className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="text-white font-black text-lg">
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sticky top-28">
            <h2 className="text-lg font-bold text-white mb-6 tracking-wider uppercase">
              Total
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Items</span>
                <span className="text-white font-bold">{cart.items_count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-bold">{formatPrice(cart.total)}</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-white font-bold text-lg">Amount Due</span>
                <span className="text-[#39ff14] font-black text-2xl">{formatPrice(cart.total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-[#39ff14] hover:bg-[#32e612] text-black font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] flex items-center justify-center gap-2"
            >
              Checkout
              <ArrowRight size={16} />
            </Link>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/shop"
                className="text-center text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};