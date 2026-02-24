import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Globe, Clock, Users, ArrowLeft, ShoppingBag, Minus, Plus, Ticket } from 'lucide-react';
import { useEvent } from '../features/events/hooks';
import { useAddToCart } from '../features/cart/hooks';
import { formatPrice, formatDateRange, formatDateTime } from '../shared/lib/formatters';
import { PageSpinner } from '../shared/ui/Spinner';
import { Badge } from '../shared/ui/Badge';
import { EmptyState } from '../shared/ui/EmptyState';
import { useToast } from '../shared/ui/toast-context';

export const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError } = useEvent(id!);
  const addToCart = useAddToCart();
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  if (isLoading) return <PageSpinner />;

  if (isError || !event) {
    return (
      <EmptyState
        title="Event Not Found"
        description="It may have been removed or the link is invalid"
        actionLabel="Back to Events"
        actionTo="/events"
      />
    );
  }

  const getQty = (ticketId: number) => quantities[ticketId] || 1;
  const setQty = (ticketId: number, val: number) => {
    setQuantities((prev) => ({ ...prev, [ticketId]: Math.max(1, val) }));
  };

  const handleAddToCart = (ticketTypeId: number) => {
    addToCart.mutate(
      { item_type: 'ticket', ticket_type_id: ticketTypeId, quantity: getQty(ticketTypeId) },
      {
        onSuccess: () => toast('Ticket added to cart', 'success'),
        onError: () => toast('Failed to add ticket', 'error'),
      }
    );
  };

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Back Link */}
      <Link to="/events" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase mb-8 transition-colors w-fit">
        <ArrowLeft size={14} />
        All Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
            {event.image ? (
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#1a1a1a] flex items-center justify-center">
                <Calendar size={64} className="text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2 mb-3">
                <Badge variant="neon">
                  {event.format === 'online' ? 'Online' : 'Offline'}
                </Badge>
                {event.is_free && <Badge variant="success">Free</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-4 tracking-wider uppercase">Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Schedule & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <Clock size={16} className="text-[#39ff14]" />
                Schedule
              </h3>
              <p className="text-white font-bold text-lg mb-1">
                {formatDateRange(event.start_datetime, event.end_datetime)}
              </p>
              <p className="text-gray-400 text-sm">
                Starts: {formatDateTime(event.start_datetime)}
              </p>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                {event.format === 'online' ? (
                  <Globe size={16} className="text-[#39ff14]" />
                ) : (
                  <MapPin size={16} className="text-[#39ff14]" />
                )}
                {event.format === 'online' ? 'Stream' : 'Venue'}
              </h3>
              {(() => {
                if (event.format === 'online' && event.online_info) {
                  return (
                    <div>
                      <p className="text-white font-bold text-lg mb-1">Online</p>
                      {event.online_info.platform && (
                        <p className="text-gray-400 text-sm">Platform: {event.online_info.platform}</p>
                      )}
                    </div>
                  );
                }
                if (event.location) {
                  return (
                    <div>
                      <p className="text-white font-bold text-lg mb-1">{event.location.city}</p>
                      <p className="text-gray-400 text-sm">{event.location.address}</p>
                    </div>
                  );
                }
                return <p className="text-gray-400">Location TBD</p>;
              })()}
            </div>
          </div>
        </div>

        {/* Sidebar — Tickets */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sticky top-28">
            <h2 className="text-lg font-bold text-white mb-6 tracking-wider uppercase flex items-center gap-2">
              <Ticket size={18} className="text-[#39ff14]" />
              Tickets
            </h2>

            {event.ticket_types && event.ticket_types.length > 0 ? (
              <div className="space-y-4">
                {event.ticket_types.map((ticket) => {
                  const available = ticket.quantity_total - ticket.quantity_sold;
                  const soldOut = available <= 0;

                  return (
                    <div
                      key={ticket.id}
                      className={`border rounded-xl p-4 transition-all ${
                        soldOut ? 'border-white/5 opacity-50' : 'border-white/10 hover:border-[#39ff14]/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-bold">{ticket.name}</h4>
                          <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                            <Users size={12} />
                            {soldOut ? 'Sold Out' : `Remaining: ${available}`}
                          </p>
                        </div>
                        <span className="text-[#39ff14] font-black text-lg">
                          {event.is_free ? 'Free' : formatPrice(ticket.price)}
                        </span>
                      </div>

                      {!soldOut && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-white/5 rounded-lg">
                            <button
                              onClick={() => setQty(ticket.id, getQty(ticket.id) - 1)}
                              className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 text-white font-bold text-sm min-w-[2rem] text-center">
                              {getQty(ticket.id)}
                            </span>
                            <button
                              onClick={() => setQty(ticket.id, Math.min(getQty(ticket.id) + 1, available))}
                              className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(ticket.id)}
                            disabled={addToCart.isPending}
                            className="flex-1 bg-[#39ff14] hover:bg-[#32e612] text-black font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(57,255,20,0.2)] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <ShoppingBag size={14} />
                            Add to Cart
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                {event.is_free ? 'Free entry' : 'Tickets coming soon'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};