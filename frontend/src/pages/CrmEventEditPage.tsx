import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, MapPin, Globe, Image, Trash2 } from 'lucide-react';
import { useToast } from '../shared/ui/toast-context';
import { getMockEvent } from '../shared/api/mock-data';

export const CrmEventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const event = getMockEvent(id ?? '');

  const [format, setFormat] = useState<'offline' | 'online'>(event?.format ?? 'offline');

  if (!event) {
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

  const handleSubmit = (e: globalThis.Event | { preventDefault: () => void }) => {
    e.preventDefault();
    toast('Event updated successfully!', 'success');
    navigate('/crm/events');
  };

  const handleDelete = () => {
    toast('Event deleted.', 'success');
    navigate('/crm/events');
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
          onClick={handleDelete}
          className="bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-red-500/20 transition-colors flex items-center gap-2"
        >
          <Trash2 size={14} />
          Delete Event
        </button>
      </div>

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
              <input id="event-title" type="text" defaultValue={event.title} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="event-description" className={labelClass}>Description</label>
              <textarea id="event-description" rows={5} defaultValue={event.description} className={inputClass + ' resize-none'} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-datetime" className={labelClass}>Start Date & Time</label>
                <input id="start-datetime" type="datetime-local" defaultValue={event.start_datetime.slice(0, 16)} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="end-datetime" className={labelClass}>End Date & Time</label>
                <input id="end-datetime" type="datetime-local" defaultValue={event.end_datetime.slice(0, 16)} className={inputClass} required />
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
                  <input id="event-city" type="text" defaultValue={event.location?.city ?? ''} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="event-address" className={labelClass}>Address</label>
                  <input id="event-address" type="text" defaultValue={event.location?.address ?? ''} className={inputClass} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stream-url" className={labelClass}>Stream URL</label>
                  <input id="stream-url" type="url" defaultValue={event.online_info?.url ?? ''} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="stream-platform" className={labelClass}>Platform</label>
                  <input id="stream-platform" type="text" defaultValue={event.online_info?.platform ?? ''} className={inputClass} />
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
            <select defaultValue={event.status} className="w-full bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#39ff14]">
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
                <input type="checkbox" defaultChecked={event.is_free} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#39ff14] transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#39ff14] text-black px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};