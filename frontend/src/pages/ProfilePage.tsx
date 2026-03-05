import { useState } from 'react';
import { useAuthStore } from '../features/auth/store';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Save, ArrowLeft } from 'lucide-react';

// Автоформатирование номера: +7 777 777 7777
function formatPhone(raw: string): string {
  // Оставляем только цифры и ведущий +
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return '';

  // Формат: +X XXX XXX XXXX
  let result = '+';
  if (digits.length > 0) result += digits[0];
  if (digits.length > 1) result += ' ' + digits.slice(1, 4);
  if (digits.length > 4) result += ' ' + digits.slice(4, 7);
  if (digits.length > 7) result += ' ' + digits.slice(7, 11);
  return result;
}

export const ProfilePage = () => {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all duration-300';
  const labelClass = 'block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest';

  return (
    <div className="max-w-xl mx-auto pb-24">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase mb-8 transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <h1 className="text-3xl font-black tracking-tight text-white mb-2">My Profile</h1>
      <p className="text-gray-500 text-sm mb-8">Manage your personal information</p>

      {/* Avatar card */}
      <div className="flex items-center gap-5 bg-[#111] border border-white/5 rounded-2xl p-6 mb-8">
        <div className="w-16 h-16 rounded-full bg-[#39ff14]/10 border-2 border-[#39ff14]/30 flex items-center justify-center text-[#39ff14] text-2xl font-black shrink-0">
          {(firstName?.[0] ?? user.email[0]).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-bold text-lg">
            {firstName || lastName ? `${firstName} ${lastName}`.trim() : '—'}
          </p>
          <p className="text-gray-400 text-sm">{user.email}</p>
          <span className={`inline-block mt-2 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full ${
            user.is_organizer
              ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30'
              : 'bg-white/5 text-gray-400 border border-white/10'
          }`}>
            {user.is_organizer ? 'Organizer' : 'Member'}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <User size={16} className="text-[#39ff14]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Personal Info</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input
              className={inputClass}
              type="text"
              placeholder="Bekzat"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              className={inputClass}
              type="text"
              placeholder="Akhmet"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Email — только для чтения */}
        <div>
          <label className={labelClass}>Email (cannot be changed)</label>
          <input
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed"
            type="email"
            value={user.email}
            disabled
          />
        </div>

        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5">
              <Phone size={12} />
              Phone
            </span>
          </label>
          <input
            className={inputClass}
            type="tel"
            placeholder="+7 777 777 7777"
            value={phone}
            onChange={handlePhoneChange}
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-[#39ff14] hover:bg-[#32e612] text-black font-bold py-3 px-6 rounded-xl uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all duration-300"
        >
          <Save size={15} />
          Save Changes
        </button>

        {saved && (
          <p className="text-center text-[#39ff14] text-sm font-bold animate-pulse">
            ✓ Saved successfully
          </p>
        )}
      </form>
    </div>
  );
};
