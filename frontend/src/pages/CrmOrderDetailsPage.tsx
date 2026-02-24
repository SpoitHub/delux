import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, User, ShoppingBag, Ticket, Calendar } from 'lucide-react';
import { formatPrice, formatDateTime } from '../shared/lib/formatters';
import { getMockOrder } from '../shared/api/mock-data';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  delivered: 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20',
  cancelled: 'bg-red-500/10 text-red-500 border border-red-500/20',
  paid: 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20',
  failed: 'bg-red-500/10 text-red-500 border border-red-500/20',
  refunded: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
};

export const CrmOrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const order = getMockOrder(id ?? '');

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Order Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">This order doesn't exist or hasn't been placed yet.</p>
        <Link to="/crm/orders" className="text-[#39ff14] text-xs font-bold tracking-widest uppercase hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link to="/crm/orders" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors w-fit">
        <ArrowLeft size={14} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">
            ORDER <span className="text-[#39ff14]">#{order.id}</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">
            Placed: {formatDateTime(order.created_at)}
          </p>
        </div>
        <div className="flex gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${STATUS_STYLES[order.status] ?? STATUS_STYLES.pending}`}>
            {order.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${STATUS_STYLES[order.payment_status] ?? STATUS_STYLES.pending}`}>
            {order.payment_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <Package size={16} className="text-[#39ff14]" />
              Order Items ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => {
                const isTicket = item.item_type === 'ticket';
                const name = isTicket
                  ? `${item.event?.title ?? 'Event'} — ${item.ticket_type?.name ?? 'Ticket'}`
                  : item.product?.title ?? 'Product';
                const image = isTicket ? item.event?.image : item.product?.images?.[0]?.image;

                let itemIcon;
                if (image) {
                  itemIcon = <img src={image} alt={name} className="w-full h-full object-cover" />;
                } else if (isTicket) {
                  itemIcon = <Ticket size={18} className="text-white/20" />;
                } else {
                  itemIcon = <ShoppingBag size={18} className="text-white/20" />;
                }

                return (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-white/5 last:border-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center">
                      {itemIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 flex items-center gap-1">
                        {isTicket ? <><Calendar size={10} /> Ticket</> : <><ShoppingBag size={10} /> Product</>}
                      </span>
                      <h3 className="text-white font-bold truncate">{name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-400 text-sm">{formatPrice(item.unit_price)} × {item.quantity}</span>
                        <span className="text-white font-bold">{formatPrice(item.total_price)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase mb-4">Update Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                <button
                  key={s}
                  className={`px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all border ${
                    order.status === s
                      ? 'border-[#39ff14]/50 bg-[#39ff14]/10 text-[#39ff14]'
                      : 'border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Total */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Order Total</h3>
            <div className="text-3xl font-black text-[#39ff14]">{formatPrice(order.total)}</div>
          </div>

          {/* Payment */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
              <CreditCard size={14} className="text-[#39ff14]" />
              Payment
            </h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${STATUS_STYLES[order.payment_status] ?? STATUS_STYLES.pending}`}>
              {order.payment_status}
            </span>
          </div>

          {/* Delivery */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Delivery</h3>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/5 text-gray-300 border border-white/10">
              {order.delivery_type}
            </span>
          </div>

          {/* Contact */}
          {order.contact && (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                <User size={14} className="text-[#39ff14]" />
                Contact
              </h3>
              <p className="text-white font-bold">{order.contact.name}</p>
              <p className="text-gray-400 text-sm">{order.contact.phone}</p>
            </div>
          )}

          {/* Shipping */}
          {order.shipping_address && (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-[#39ff14]" />
                Shipping Address
              </h3>
              <p className="text-white font-bold">{order.shipping_address.city}</p>
              <p className="text-gray-400 text-sm">{order.shipping_address.address_line}</p>
              {order.shipping_address.postal_code && (
                <p className="text-gray-400 text-sm">{order.shipping_address.postal_code}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};