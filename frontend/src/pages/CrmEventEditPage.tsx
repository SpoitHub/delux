import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, MapPin, Globe, Image, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '../shared/ui/toast-context';
import { useCrmEvent, useUpdateCrmEvent, useDeleteCrmEvent } from '../features/crm/hooks';

export const CrmEventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: event, isLoading, error } = useCrmEvent(id ?? '');
  const updateEvent = useUpdateCrmEvent(id ?? '');
  const deleteEvent = useDeleteCrmEvent();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');
  const [format, setFormat] = useState<'offline' | 'online'>('offline');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [streamPlatform, setStreamPlatform] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [eventStatus, setEventStatus] = useState<'draft' | 'published' | 'cancelled' | 'completed'>('draft');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setStartDatetime(event.start_datetime.slice(0, 16));
      setEndDatetime(event.end_datetime.slice(0, 16));
      setFormat(event.format);
      setCity(event.location?.city ?? '');
      setAddress(event.location?.address ?? '');
      setStreamUrl(event.online_info?.url ?? '');
      setStreamPlatform(event.online_info?.platform ?? '');
      setIsFree(event.is_free);
      setEventStatus(event.status);
    }
  }, [event]);

  if (isLoading) {
    return <div className="flex items-center justify-center py-24 text-gray-500 text-sm">Loading event...</div>;
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Event Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">The event you're looking for doesn't exist.</p>
        <Link to="/crm/events" className="text-[#39ff14] text-xs font-bold tracking-widest uppercase hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEvent.mutateAsync({
        title,
        description,
        format,
        start_datetime: new Date(startDatetime).toISOString(),
        end_datetime: new Date(endDatetime).toISOString(),
        is_free: isFree,
        status: eventStatus,
        location: format === 'offline' ? { city, address } : null,
        online_info: format === 'online' && streamUrl ? { url: streamUrl, platform: streamPlatform } : null,
      });
      toast('Event updated successfully!', 'success');
      navigate('/crm/events');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update event', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent.mutateAsync(id ?? '');
      toast('Event deleted.', 'success');
      navigate('/crm/events');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to delete event', 'error');
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] transition-colors text-sm';
  const labelClass = 'block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest';

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link to="/crm/events" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors w-fit">
        <ArrowLeft size={14} />
        Back to Events
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">EDIT EVENT</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Editing: {event.title}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-red-500/20 transition-colors flex items-center gap-2"
        >
          <Trash2 size={14} />
          Delete Event
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-black text-lg tracking-tight">Delete Event?</h3>
                <p className="text-gray-400 text-xs mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              You are about to permanently delete <span className="text-white font-bold">&ldquo;{event.title}&rdquo;</span>.
              All ticket types and data will be removed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-white/10 rounded-xl text-gray-400 text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteEvent.isPending}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 size={13} />
                {deleteEvent.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-[#39ff14]" />
              Basic Information
            </h2>
            <div>
              <label htmlFor="event-title" className={labelClass}>Event Title</label>
              <input id="event-title" type="text" className={inputClass} required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label htmlFor="event-description" className={labelClass}>Description</label>
              <textarea id="event-description" rows={5} className={inputClass + ' resize-none'} required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-datetime" className={labelClass}>Start Date & Time</label>
                <input id="start-datetime" type="datetime-local" className={inputClass} required value={startDatetime} onChange={(e) => setStartDatetime(e.target.value)} />
              </div>
              <div>
                <label htmlFor="end-datetime" className={labelClass}>End Date & Time</label>
                <input id="end-datetime" type="datetime-local" className={inputClass} required value={endDatetime} onChange={(e) => setEndDatetime(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Format */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase mb-2">Format</h2>
            <div className="grid grid-cols-2 gap-3">
              {(['offline', 'online'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    format === f
                      ? 'border-[#39ff14]/50 bg-[#39ff14]/5'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  {f === 'offline' ? <MapPin size={18} className={format === f ? 'text-[#39ff14] mb-2' : 'text-gray-500 mb-2'} /> : <Globe size={18} className={format === f ? 'text-[#39ff14] mb-2' : 'text-gray-500 mb-2'} />}
                  <p className={`font-bold text-sm capitalize ${format === f ? 'text-[#39ff14]' : 'text-white'}`}>{f}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{f === 'offline' ? 'Physical venue event' : 'Virtual / streamed event'}</p>
                </button>
              ))}
            </div>

            {format === 'offline' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-city" className={labelClass}>City</label>
                  <input id="event-city" type="text" className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="event-address" className={labelClass}>Address</label>
                  <input id="event-address" type="text" className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stream-url" className={labelClass}>Stream URL</label>
                  <input id="stream-url" type="url" className={inputClass} value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="stream-platform" className={labelClass}>Platform</label>
                  <input id="stream-platform" type="text" className={inputClass} value={streamPlatform} onChange={(e) => setStreamPlatform(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Ticket Types */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase mb-2">Ticket Types</h2>
            {event.ticket_types.map((ticket) => (
              <div key={ticket.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-white/5 rounded-xl">
                <div>
                  <label htmlFor={`ticket-name-${ticket.id}`} className={labelClass}>Name</label>
                  <input id={`ticket-name-${ticket.id}`} type="text" defaultValue={ticket.name} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={`ticket-price-${ticket.id}`} className={labelClass}>Price (KZT)</label>
                  <input id={`ticket-price-${ticket.id}`} type="number" defaultValue={ticket.price} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={`ticket-qty-${ticket.id}`} className={labelClass}>Total Qty</label>
                  <input id={`ticket-qty-${ticket.id}`} type="number" defaultValue={ticket.quantity_total} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={`ticket-sold-${ticket.id}`} className={labelClass}>Sold</label>
                  <input id={`ticket-sold-${ticket.id}`} type="number" defaultValue={ticket.quantity_sold} className={inputClass} readOnly />
                </div>
              </div>
            ))}
            {event.ticket_types.length === 0 && (
              <p className="text-gray-500 text-xs">No ticket types. This is a free event.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <Image size={16} className="text-[#39ff14]" />
              Cover Image
            </h3>
            {event.image ? (
              <img src={event.image} alt={event.title} className="w-full h-40 object-cover rounded-xl mb-3" />
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
                <Image size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-xs font-bold">No image</p>
              </div>
            )}
            <button type="button" className="w-full mt-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold tracking-widest uppercase rounded-xl py-2 hover:bg-white/10 transition-colors">
              Change Image
            </button>
          </div>

          {/* Status */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-4">Status</h3>
            <select className="w-full bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#39ff14]" value={eventStatus} onChange={(e) => setEventStatus(e.target.value as typeof eventStatus)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Free event */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white text-sm font-bold tracking-widest uppercase">Free Event</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#39ff14] transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={updateEvent.isPending}
            className="w-full bg-[#39ff14] text-black px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {updateEvent.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};