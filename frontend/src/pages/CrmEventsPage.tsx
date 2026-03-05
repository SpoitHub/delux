import { useState } from 'react';
import { Search, Plus, Edit, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCrmEvents, usePublishCrmEvent, useUnpublishCrmEvent } from '../features/crm/hooks';
import { formatDate } from '../shared/lib/formatters';

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20',
  draft:     'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
  completed: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
};

export const CrmEventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data: events = [], isLoading } = useCrmEvents();
  const publishMutation = usePublishCrmEvent();
  const unpublishMutation = useUnpublishCrmEvent();

  const filtered = events.filter((e) => {
    const matchSearch = !searchTerm || e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">EVENTS</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Manage your upcoming and past events</p>
        </div>
        <Link 
          to="/crm/events/new" 
          className="bg-[#39ff14] text-black px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center gap-2"
        >
          <Plus size={16} />
          Create Event
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="SEARCH EVENTS..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#39ff14] transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-xl px-4 py-3 outline-none focus:border-[#39ff14] w-full md:w-auto"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">ID</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Title</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Date & Location</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Status</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Tickets</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 text-sm">Loading events...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 text-sm">No events found. <Link to="/crm/events/new" className="text-[#39ff14] hover:underline">Create your first event →</Link></td></tr>
              ) : filtered.map((event) => {
                const totalSold = event.ticket_types.reduce((s, t) => s + t.quantity_sold, 0);
                const totalQty  = event.ticket_types.reduce((s, t) => s + t.quantity_total, 0);
                return (
                  <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-gray-500 text-xs font-bold tracking-widest uppercase">EVT-{String(event.id).padStart(3, '0')}</td>
                    <td className="p-4">
                      <div className="text-white text-sm font-bold">{event.title}</div>
                      <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mt-0.5">{event.is_free ? 'Free' : event.format}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300 text-xs font-bold mb-1">{formatDate(event.start_datetime)}</div>
                      <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                        {event.location ? `${event.location.city}` : event.online_info?.platform || 'Online'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${STATUS_STYLES[event.status] ?? STATUS_STYLES.completed}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {event.ticket_types.length > 0 ? (
                        <>
                          <div className="text-white text-sm font-black">{totalSold} / {totalQty}</div>
                          <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">Sold</div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-xs font-bold">—</div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {event.status === 'draft' && (
                          <button
                            onClick={() => publishMutation.mutate(event.id)}
                            className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-lg bg-[#39ff14]/10 text-[#39ff14] hover:bg-[#39ff14]/20 transition-colors"
                          >
                            Publish
                          </button>
                        )}
                        {event.status === 'published' && (
                          <button
                            onClick={() => unpublishMutation.mutate(event.id)}
                            className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-colors"
                          >
                            Unpublish
                          </button>
                        )}
                        <Link to={`/events/${event.id}`} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="View public page">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/crm/events/${event.id}/edit`} className="p-2 text-gray-400 hover:text-[#39ff14] hover:bg-[#39ff14]/10 rounded-lg transition-colors" title="Edit event">
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs font-bold tracking-widest uppercase text-gray-500">
          <span>Showing {filtered.length} of {events.length} events</span>
        </div>
      </div>
    </div>
  );
};
