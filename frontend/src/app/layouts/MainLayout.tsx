import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store';

export const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-gray-100 font-sans relative overflow-hidden">
      {/* Futuristic background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-10 h-10 mr-3 relative flex items-center justify-center">
                  {/* Abstract S Logo representation */}
                  <div className="absolute inset-0 bg-green-500 rounded-lg transform -skew-x-12 group-hover:shadow-[0_0_15px_rgba(57,255,20,0.6)] transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-black m-1 rounded-md transform -skew-x-12 flex items-center justify-center">
                    <span className="text-green-500 font-black text-xl italic">S</span>
                  </div>
                </div>
                <span className="text-3xl font-extrabold tracking-tighter text-white group-hover:text-green-400 transition-colors duration-300">
                  Spoit<span className="text-green-500">Hub</span>
                </span>
              </Link>
              <nav className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <Link to="/events" className="text-gray-300 hover:text-green-400 transition-colors duration-300 px-3 py-2 text-sm font-medium uppercase tracking-wider">Events</Link>
                <Link to="/shop" className="text-gray-300 hover:text-green-400 transition-colors duration-300 px-3 py-2 text-sm font-medium uppercase tracking-wider">Shop</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="text-gray-300 hover:text-green-400 transition-colors duration-300 uppercase tracking-wider text-sm font-medium">
                Cart
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">[{user?.first_name || user?.email}]</span>
                  {user?.is_organizer && (
                    <Link to="/crm" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider font-medium">CRM</Link>
                  )}
                  <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider font-medium">Logout</button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-300 hover:text-green-400 transition-colors text-sm uppercase tracking-wider font-medium">Login</Link>
                  <Link to="/register" className="bg-green-500/10 border border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black transition-all duration-300 px-4 py-2 rounded-full text-sm uppercase tracking-wider font-semibold shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Outlet />
      </main>

      <footer className="bg-black/50 border-t border-white/10 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm tracking-widest">© 2026 SPOITHUB MVP. SYSTEM ONLINE.</p>
        </div>
      </footer>
    </div>
  );
};
