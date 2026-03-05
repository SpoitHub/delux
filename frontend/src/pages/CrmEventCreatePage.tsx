import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Calendar, MapPin, Globe, AlertCircle,
  Plus, Trash2, Upload, X,
} from 'lucide-react';
import { useToast } from '../shared/ui/toast-context';
import { useCreateCrmEvent } from '../features/crm/hooks';

type Errors = Partial<Record<string, string>>;
interface TicketRow { name: string; price: string; qty: string }

export const CrmEventCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createEvent = useCreateCrmEvent();
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Basic
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');

  // Format
  const [format, setFormat] = useState<'offline' | 'online'>('offline');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [streamPlatform, setStreamPlatform] = useState('');

  // Tickets
  const [isFree, setIsFree] = useState(false);
  const [tickets, setTickets] = useState<TicketRow[]>([{ name: '', price: '', qty: '100' }]);

  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Status + errors
  const [eventStatus, setEventStatus] = useState<'draft' | 'published'>('published');
  const [errors, setErrors] = useState<Errors>({});

  // ── Ticket helpers ──────────────────────────────────────────────────────

  const addTicket = () =>
    setTickets((prev) => [...prev, { name: '', price: '', qty: '100' }]);

  const removeTicket = (i: number) =>
    setTickets((prev) => prev.filter((_, idx) => idx !== i));

  const updateTicket = (i: number, field: keyof TicketRow, value: string) => {
    setTickets((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
    setErrors((prev) => ({ ...prev, [`t_${i}_${field}`]: undefined }));
  };

  // ── Image helpers ─────────────────────────────────────────────────────────

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // ── Validation ───────────────────────────────────────────────────────────

  const validate = (): Errors => {
    const e: Errors = {};
    if (!title.trim())       e.title = 'Event title is required.';
    if (!description.trim()) e.description = 'Description is required.';
    if (!startDatetime)      e.start = 'Start date & time is required.';
    if (!endDatetime)        e.end = 'End date & time is required.';
    if (startDatetime && endDatetime && new Date(endDatetime) <= new Date(startDatetime))
      e.end = 'End date must be after start date.';
    if (format === 'offline' && !city.trim())
      e.city = 'City is required for offline events.';
    if (format === 'online' && !streamUrl.trim())
      e.streamUrl = 'Stream URL is required for online events.';
    if (!isFree) {
      tickets.forEach((t, i) => {
        if (!t.name.trim())                  e[`t_${i}_name`]  = 'Ticket name required.';
        if (!t.price || Number(t.price) <= 0) e[`t_${i}_price`] = 'Price must be > 0.';
        if (!t.qty   || Number(t.qty)   < 1)  e[`t_${i}_qty`]   = 'Qty must be ≥ 1.';
      });
    }
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await createEvent.mutateAsync({
        title:          title.trim(),
        description:    description.trim(),
        format,
        start_datetime: new Date(startDatetime).toISOString(),
        end_datetime:   new Date(endDatetime).toISOString(),
        is_free:        isFree,
        status:         eventStatus,
        location:       format === 'offline' ? { city: city.trim(), address: address.trim() } : null,
        online_info:    format === 'online' && streamUrl
          ? { url: streamUrl.trim(), platform: streamPlatform.trim() }
          : null,
        ticket_types: !isFree
          ? tickets.map((t) => ({ name: t.name.trim(), price: Number(t.price), quantity_total: Number(t.qty) }))
          : [],
        image: imageFile ?? undefined,
      });
      toast('Event created successfully!', 'success');
      navigate('/crm/events');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create event', 'error');
    }
  };

  // ── Style helpers ────────────────────────────────────────────────────────

  const base = 'w-full bg-white/5 border rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none transition-colors text-sm';
  const inp = (field: string) =>
    `${base} ${errors[field] ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-[#39ff14]'}`;
  const lbl = 'block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest';
  const err = (field: string) =>
    errors[field] ? (
      <p className="mt-1.5 flex items-center gap-1 text-red-400 text-[11px] font-bold">
        <AlertCircle size={11} /> {errors[field]}
      </p>
    ) : null;

  const errorList = Object.values(errors).filter(Boolean) as string[];

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        to="/crm/events"
        className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors w-fit"
      >
        <ArrowLeft size={14} /> Back to Events
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white mb-1">CREATE EVENT</h1>
        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Fill in the details to publish a new event</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Main column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2">
              <Calendar size={16} className="text-[#39ff14]" /> Basic Information
            </h2>
            <div>
              <label htmlFor="ev-title" className={lbl}>Event Title <span className="text-red-400">*</span></label>
              <input
                id="ev-title" type="text" placeholder="e.g. Urban Marathon 2026"
                className={inp('title')} value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
              />
              {err('title')}
            </div>
            <div>
              <label htmlFor="ev-desc" className={lbl}>Description <span className="text-red-400">*</span></label>
              <textarea
                id="ev-desc" rows={5} placeholder="Describe your event..."
                className={inp('description') + ' resize-none'} value={description}
                onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: undefined })); }}
              />
              {err('description')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ev-start" className={lbl}>Start Date & Time <span className="text-red-400">*</span></label>
                <input
                  id="ev-start" type="datetime-local" className={inp('start')} value={startDatetime}
                  onChange={(e) => { setStartDatetime(e.target.value); setErrors((p) => ({ ...p, start: undefined, end: undefined })); }}
                />
                {err('start')}
              </div>
              <div>
                <label htmlFor="ev-end" className={lbl}>End Date & Time <span className="text-red-400">*</span></label>
                <input
                  id="ev-end" type="datetime-local" className={inp('end')} value={endDatetime}
                  onChange={(e) => { setEndDatetime(e.target.value); setErrors((p) => ({ ...p, end: undefined })); }}
                />
                {err('end')}
              </div>
            </div>
          </div>

          {/* Format */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase">Format</h2>
            <div className="grid grid-cols-2 gap-3">
              {(['offline', 'online'] as const).map((f) => (
                <button
                  key={f} type="button"
                  onClick={() => { setFormat(f); setErrors((p) => ({ ...p, city: undefined, streamUrl: undefined })); }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    format === f ? 'border-[#39ff14]/50 bg-[#39ff14]/5' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  {f === 'offline'
                    ? <MapPin size={18} className={`mb-2 ${format === f ? 'text-[#39ff14]' : 'text-gray-500'}`} />
                    : <Globe   size={18} className={`mb-2 ${format === f ? 'text-[#39ff14]' : 'text-gray-500'}`} />}
                  <p className={`font-bold text-sm capitalize ${format === f ? 'text-[#39ff14]' : 'text-white'}`}>{f}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{f === 'offline' ? 'Physical venue event' : 'Virtual / streamed event'}</p>
                </button>
              ))}
            </div>
            {format === 'offline' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ev-city" className={lbl}>City <span className="text-red-400">*</span></label>
                  <input
                    id="ev-city" type="text" placeholder="e.g. Almaty"
                    className={inp('city')} value={city}
                    onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: undefined })); }}
                  />
                  {err('city')}
                </div>
                <div>
                  <label htmlFor="ev-addr" className={lbl}>Address</label>
                  <input id="ev-addr" type="text" placeholder="e.g. Central Park West"
                    className={inp('')} value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ev-url" className={lbl}>Stream URL <span className="text-red-400">*</span></label>
                  <input
                    id="ev-url" type="url" placeholder="https://..."
                    className={inp('streamUrl')} value={streamUrl}
                    onChange={(e) => { setStreamUrl(e.target.value); setErrors((p) => ({ ...p, streamUrl: undefined })); }}
                  />
                  {err('streamUrl')}
                </div>
                <div>
                  <label htmlFor="ev-platform" className={lbl}>Platform</label>
                  <input id="ev-platform" type="text" placeholder="e.g. Zoom, YouTube"
                    className={inp('')} value={streamPlatform} onChange={(e) => setStreamPlatform(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Ticket Types */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-sm font-bold tracking-widest uppercase">Ticket Types</h2>
              {/* Free toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">Free Event</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" checked={isFree}
                    onChange={(e) => {
                      setIsFree(e.target.checked);
                      setErrors((p) => {
                        const next = { ...p };
                        Object.keys(next).filter((k) => k.startsWith('t_')).forEach((k) => delete next[k]);
                        return next;
                      });
                    }} />
                  <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-[#39ff14] transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            </div>

            {isFree ? (
              <p className="text-[#39ff14]/70 text-xs font-bold tracking-widest uppercase bg-[#39ff14]/5 border border-[#39ff14]/20 rounded-xl p-3">
                This event is free — no tickets required.
              </p>
            ) : (
              <div className="space-y-4">
                {tickets.map((t, i) => (
                  <div key={i} className="border border-white/8 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">Ticket #{i + 1}</span>
                      {tickets.length > 1 && (
                        <button type="button" onClick={() => removeTicket(i)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className={lbl}>Name <span className="text-red-400">*</span></label>
                        <input type="text" placeholder="e.g. Standard"
                          className={inp(`t_${i}_name`)} value={t.name}
                          onChange={(e) => updateTicket(i, 'name', e.target.value)} />
                        {err(`t_${i}_name`)}
                      </div>
                      <div>
                        <label className={lbl}>Price (KZT) <span className="text-red-400">*</span></label>
                        <input type="number" placeholder="0" min="1"
                          className={inp(`t_${i}_price`)} value={t.price}
                          onChange={(e) => updateTicket(i, 'price', e.target.value)} />
                        {err(`t_${i}_price`)}
                      </div>
                      <div>
                        <label className={lbl}>Quantity <span className="text-red-400">*</span></label>
                        <input type="number" placeholder="100" min="1"
                          className={inp(`t_${i}_qty`)} value={t.qty}
                          onChange={(e) => updateTicket(i, 'qty', e.target.value)} />
                        {err(`t_${i}_qty`)}
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addTicket}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/15 rounded-xl text-gray-400 hover:border-[#39ff14]/40 hover:text-[#39ff14] transition-all text-xs font-bold tracking-widest uppercase">
                  <Plus size={14} /> Add Another Ticket Type
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">

          {/* Cover Image */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <Upload size={16} className="text-[#39ff14]" /> Cover Image
            </h3>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover rounded-xl" />
                <button type="button" onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-red-500/80 text-white p-1.5 rounded-full transition-colors">
                  <X size={14} />
                </button>
                <p className="mt-2 text-gray-500 text-[10px] font-bold truncate">{imageFile?.name}</p>
              </div>
            ) : (
              <div onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#39ff14]/40 hover:bg-white/2 transition-all cursor-pointer">
                <Upload size={28} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-xs font-bold">Click to upload</p>
                <p className="text-gray-600 text-[10px] mt-1">PNG, JPG, WEBP up to 5 MB</p>
              </div>
            )}

            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

            {!imagePreview && (
              <button type="button" onClick={() => imageInputRef.current?.click()}
                className="mt-3 w-full py-2 border border-white/10 rounded-xl text-gray-400 text-xs font-bold tracking-widest uppercase hover:border-[#39ff14]/30 hover:text-[#39ff14] transition-colors">
                Browse File
              </button>
            )}
          </div>

          {/* Visibility */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-3">Visibility</h3>
            <div className="space-y-2">
              {(['published', 'draft'] as const).map((s) => (
                <label key={s} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  eventStatus === s ? 'border-[#39ff14]/40 bg-[#39ff14]/5' : 'border-white/5 hover:border-white/15'
                }`}>
                  <input type="radio" name="status" value={s} checked={eventStatus === s}
                    onChange={() => setEventStatus(s)} className="sr-only" />
                  <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${eventStatus === s ? 'bg-[#39ff14]' : 'bg-white/20'}`} />
                  <div>
                    <p className={`text-xs font-bold tracking-widest uppercase ${eventStatus === s ? 'text-[#39ff14]' : 'text-gray-300'}`}>
                      {s === 'published' ? 'Publish Now' : 'Save as Draft'}
                    </p>
                    <p className="text-gray-500 text-[10px] mt-0.5">
                      {s === 'published' ? 'Visible on /events immediately' : 'Only visible to you in CRM'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Error summary */}
          {errorList.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <p className="text-red-400 text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                <AlertCircle size={13} /> Fix {errorList.length} error{errorList.length > 1 ? 's' : ''} to continue
              </p>
              <ul className="space-y-1">
                {errorList.map((msg, i) => (
                  <li key={i} className="text-red-400/80 text-[11px]">• {msg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={createEvent.isPending}
            className="w-full bg-[#39ff14] text-black px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2 disabled:opacity-50">
            <Save size={16} />
            {createEvent.isPending ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};