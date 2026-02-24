import { useState } from 'react';
import { Search, Filter, MapPin, Calendar, ArrowRight, Globe, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../features/events/hooks';
import { formatPrice, formatDate } from '../shared/lib/formatters';
import { EventCardSkeleton } from '../shared/ui/Skeleton';
import { EmptyState } from '../shared/ui/EmptyState';
import type { EventFilters } from '../entities/types';

const FORMAT_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'offline', label: 'Offline' },
  { value: 'online', label: 'Online' },
];

const PRICE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

export const EventsListPage = () => {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filters: EventFilters = {};
  if (searchQuery) filters.search = searchQuery;
  if (formatFilter) filters.format = formatFilter as 'online' | 'offline';
  if (priceFilter === 'free') filters.is_free = true;
  if (priceFilter === 'paid') filters.is_free = false;

  const { data, isLoading, isError } = useEvents(filters);

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(search);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchQuery('');
    setFormatFilter('');
    setPriceFilter('');
  };

  const hasActiveFilters = searchQuery || formatFilter || priceFilter;
  const events = data?.results ?? [];

  return (
    <div className="flex flex-col w-full min-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
            <span className="text-white block">UPCOMING</span>
            <span className="text-[#39ff14] block">EVENTS</span>
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH EVENTS..."
            className="w-full bg-[#111] border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-full py-4 pl-12 pr-4 focus:outline-none focus:border-[#39ff14] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute inset-y-2 right-2 bg-[#39ff14] text-black p-2 rounded-full hover:bg-[#32e612] transition-colors"
          >
            <Filter size={14} />
          </button>
        </form>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-8 space-y-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-2 block">Format</span>
              <div className="flex gap-2">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFormatFilter(opt.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-300 ${
                      formatFilter === opt.value
                        ? 'bg-[#39ff14] text-black'
                        : 'bg-white/5 text-gray-400 border border-white/5 hover:border-[#39ff14]/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-2 block">Price</span>
              <div className="flex gap-2">
                {PRICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPriceFilter(opt.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-300 ${
                      priceFilter === opt.value
                        ? 'bg-[#39ff14] text-black'
                        : 'bg-white/5 text-gray-400 border border-white/5 hover:border-[#39ff14]/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <EmptyState
          title="Loading Error"
          description="Could not load events. Please try again later."
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && events.length === 0 && (
        <EmptyState
          title="No Events Found"
          description={hasActiveFilters ? 'Try adjusting your search criteria' : 'No events available yet'}
        />
      )}

      {/* Events Grid */}
      {!isLoading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const minPrice = event.ticket_types?.length
              ? Math.min(...event.ticket_types.map((t) => t.price))
              : 0;

            return (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#39ff14]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] flex flex-col"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#1a1a1a] flex items-center justify-center">
                      <Calendar size={48} className="text-white/10" />
                    </div>
                  )}

                  {/* Format Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                    <span className="text-[#39ff14] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                      {event.format === 'online' ? <Globe size={10} /> : <MapPin size={10} />}
                      {event.format === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-[#39ff14] text-black px-3 py-1 rounded-full font-black text-sm">
                    {event.is_free ? 'Free' : formatPrice(minPrice)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-white mb-4 tracking-tight group-hover:text-[#39ff14] transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center text-gray-400 text-xs font-bold tracking-wider uppercase">
                      <Calendar size={14} className="mr-2 text-[#39ff14]" />
                      {formatDate(event.start_datetime)}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-400 text-xs font-bold tracking-wider uppercase">
                        <MapPin size={14} className="mr-2 text-[#39ff14]" />
                        <span className="truncate">{event.location.city}{event.location.address ? `, ${event.location.address}` : ''}</span>
                      </div>
                    )}
                    {event.format === 'online' && (
                      <div className="flex items-center text-gray-400 text-xs font-bold tracking-wider uppercase">
                        <Globe size={14} className="mr-2 text-[#39ff14]" />
                        Online Stream
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-white text-xs font-bold tracking-widest uppercase">Details</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#39ff14] group-hover:text-black transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination info */}
      {data && data.count > 0 && (
        <div className="mt-8 text-center text-gray-500 text-xs font-bold tracking-widest uppercase">
          Showing {events.length} of {data.count}
        </div>
      )}
    </div>
  );
};