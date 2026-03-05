import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Ticket, ChevronRight } from 'lucide-react';
import { useOrders } from '../features/orders/hooks';
import { formatPrice, formatDateTime } from '../shared/lib/formatters';
import { PageSpinner } from '../shared/ui/Spinner';
import { StatusBadge } from '../shared/ui/Badge';
import { EmptyState } from '../shared/ui/EmptyState';

export const OrdersListPage = () => {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) return <PageSpinner />;

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
        >
          <ArrowLeft size={14} />
          Home
        </Link>
      </div>

      <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-8">
        <span className="text-white">MY </span>
        <span className="text-[#39ff14]">ORDERS</span>
      </h1>

      {!orders || orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Complete a purchase to see your orders here"
          actionLabel="Browse Events"
          actionTo="/events"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const firstItem = order.items[0];
            const isTicket = firstItem?.item_type === 'ticket';
            const label = isTicket
              ? firstItem?.event?.title ?? 'Event ticket'
              : firstItem?.product?.title ?? 'Product';
            const extra = order.items.length > 1 ? ` +${order.items.length - 1} more` : '';

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center gap-5 bg-[#111] border border-white/5 hover:border-[#39ff14]/30 rounded-2xl p-5 transition-all duration-200 group"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  {isTicket
                    ? <Ticket size={20} className="text-[#39ff14]" />
                    : <Package size={20} className="text-[#39ff14]" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-bold text-sm">Order #{order.id}</span>
                    <StatusBadge status={order.status} />
                    <StatusBadge status={order.payment_status} />
                  </div>
                  <p className="text-gray-400 text-xs truncate">{label}{extra}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{formatDateTime(order.created_at)}</p>
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                  <p className="text-white font-bold">{formatPrice(order.total)}</p>
                  <p className="text-gray-500 text-xs">{order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                </div>

                <ChevronRight size={16} className="text-gray-600 group-hover:text-[#39ff14] transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
