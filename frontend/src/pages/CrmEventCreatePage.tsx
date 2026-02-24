import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, MapPin, Globe, Image } from 'lucide-react';
import { useToast } from '../shared/ui/toast-context';

export const CrmEventCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [format, setFormat] = useState<'offline' | 'online'>('offline');

  const handleSubmit = (e: globalThis.Event | { preventDefault: () => void }) => {
    e.preventDefault();
    toast('Event created successfully!', 'success');
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
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">CREATE EVENT</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Fill in the details to publish a new event</p>
        </div>
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
              <input id="event-title" type="text" placeholder="e.g. Urban Marathon 2026" className={inputClass} required />
            </div>
            <div>
              <label htmlFor="event-description" className={labelClass}>Description</label>
              <textarea id="event-description" rows={5} placeholder="Describe your event..." className={inputClass + ' resize-none'} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-datetime" className={labelClass}>Start Date & Time</label>
                <input id="start-datetime" type="datetime-local" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="end-datetime" className={labelClass}>End Date & Time</label>
                <input id="end-datetime" type="datetime-local" className={inputClass} required />
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
                  <input id="event-city" type="text" placeholder="e.g. New York" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="event-address" className={labelClass}>Address</label>
                  <input id="event-address" type="text" placeholder="e.g. Central Park West" className={inputClass} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stream-url" className={labelClass}>Stream URL</label>
                  <input id="stream-url" type="url" placeholder="https://..." className={inputClass} />
                </div>
                <div>
                  <label htmlFor="stream-platform" className={labelClass}>Platform</label>
                  <input id="stream-platform" type="text" placeholder="e.g. Zoom, YouTube" className={inputClass} />
                </div>
              </div>
            )}
          </div>

          {/* Ticket Types */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase mb-2">Ticket Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="ticket-name" className={labelClass}>Ticket Name</label>
                <input id="ticket-name" type="text" placeholder="e.g. Standard" className={inputClass} />
              </div>
              <div>
                <label htmlFor="ticket-price" className={labelClass}>Price (KZT)</label>
                <input id="ticket-price" type="number" placeholder="0" className={inputClass} />
              </div>
              <div>
                <label htmlFor="ticket-qty" className={labelClass}>Quantity</label>
                <input id="ticket-qty" type="number" placeholder="100" className={inputClass} />
              </div>
            </div>
            <p className="text-gray-500 text-xs">You can add more ticket types after creating the event.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <Image size={16} className="text-[#39ff14]" />
              Cover Image
            </h3>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#39ff14]/30 transition-colors cursor-pointer">
              <Image size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 text-xs font-bold">Click to upload</p>
              <p className="text-gray-600 text-[10px] mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-4">Status</h3>
            <select className="w-full bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#39ff14]">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Free event toggle */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white text-sm font-bold tracking-widest uppercase">Free Event</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
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
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};