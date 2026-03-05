import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store';
import { apiLogin } from '../shared/api/auth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  // Куда вернуться после логина (если пришли с защищённого роута)
  const from = (location.state as { from?: string } | null)?.from || '/';

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { access, refresh, user } = await apiLogin(email, password);
      login(access, refresh, user);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
    <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
      <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">SIGN IN</h2>
      
      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-center rounded-lg text-sm tracking-wide">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest" htmlFor="email">
            Email
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
            Password
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
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300"
          type="submit"
        >
          Sign In
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Don't have an account? <Link to="/register" className="text-green-400 hover:text-green-300 transition-colors">Register</Link>
        </p>
      </div>
    </div>
    </div>
  );
};
