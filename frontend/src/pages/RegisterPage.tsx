import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../shared/api/api';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/auth/register/', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Initialization failed. Verify parameters.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-green-500"></div>
      <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">INITIALIZE PROFILE</h2>
      
      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-center rounded-lg text-sm tracking-wide">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest" htmlFor="firstName">
              First Name
            </label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest" htmlFor="email">
            Identity (Email)
          </label>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
            id="email"
            type="email"
            placeholder="user@delux.net"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest" htmlFor="password">
            Passcode
          </label>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold py-3 px-4 rounded-lg uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300"
          type="submit"
        >
          Create Profile
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Already initialized? <Link to="/login" className="text-green-400 hover:text-green-300 transition-colors">Authenticate</Link>
        </p>
      </div>
    </div>
  );
};
