import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, ShoppingBag, Ticket } from 'lucide-react';
import { useOrder } from '../features/orders/hooks';
import { formatPrice, formatDateTime } from '../shared/lib/formatters';
import { PageSpinner } from '../shared/ui/Spinner';
import { EmptyState } from '../shared/ui/EmptyState';
import { StatusBadge } from '../shared/ui/Badge';

export const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useOrder(id!);

  if (isLoading) return <PageSpinner />;

  if (isError || !order) {
    return (
      <EmptyState
        title="Order Not Found"
        description="The link may be invalid"
        actionLabel="Go Home"
        actionTo="/"
      />
    );
  }

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Back */}
      <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase mb-8 transition-colors w-fit">
        <ArrowLeft size={14} />
        Go Home
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2">
            <span className="text-white">ORDER </span>
            <span className="text-[#39ff14]">#{order.id}</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Created: {formatDateTime(order.created_at)}
          </p>
        </div>
        <div className="flex gap-3">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.payment_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-6 tracking-wider uppercase flex items-center gap-2">
              <Package size={18} className="text-[#39ff14]" />
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => {
                const isTicket = item.item_type === 'ticket';
                const name = isTicket
                  ? `${item.event?.title ?? 'Event'} — ${item.ticket_type?.name ?? 'Ticket'}`
                  : item.product?.title ?? 'Product';
                const image = isTicket
                  ? item.event?.image
                  : item.product?.images?.[0]?.image;
                const fallbackIcon = isTicket
                  ? <Ticket size={20} className="text-white/20" />
                  : <ShoppingBag size={20} className="text-white/20" />;

                return (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-white/5 last:border-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center">
                      {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                      ) : fallbackIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 flex items-center gap-1">
                        {isTicket ? (
                          <><Calendar size={10} /> Ticket</>
                        ) : (
                          <><ShoppingBag size={10} /> Product</>
                        )}
                      </span>
                      <h3 className="text-white font-bold truncate">{name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-400 text-sm">
                          {formatPrice(item.unit_price)} × {item.quantity}
                        </span>
                        <span className="text-white font-bold">{formatPrice(item.total_price)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Total */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">Total</h3>
            <div className="text-3xl font-black text-[#39ff14]">{formatPrice(order.total)}</div>
          </div>

          {/* Payment Status */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-[#39ff14]" />
              Payment
            </h3>
            <StatusBadge status={order.payment_status} />
            {order.payment_status === 'pending' && (
              <Link
                to={`/payment/${order.id}`}
                className="mt-4 w-full bg-[#39ff14] hover:bg-[#32e612] text-black font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                Pay Now
              </Link>
            )}
          </div>

          {/* Contact */}
          {order.contact && (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">Contact</h3>
              <p className="text-white font-bold">{order.contact.name}</p>
              <p className="text-gray-400 text-sm">{order.contact.phone}</p>
            </div>
          )}

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-[#39ff14]" />
                Shipping
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