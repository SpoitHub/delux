import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store';
import { Search, ShoppingBag } from 'lucide-react';

export const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-gray-100 font-sans relative overflow-hidden">
      {/* Futuristic background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-10 h-10 mr-3 relative flex items-center justify-center bg-[#111] rounded-lg border border-white/10 overflow-hidden">
                  <span className="text-2xl font-black italic text-[#39ff14] transform -skew-x-12">S</span>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/events" 
                className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive('/events') ? 'text-[#39ff14] border-b-2 border-[#39ff14] pb-1' : 'text-gray-300 hover:text-white'}`}
              >
                Events
              </Link>
              <Link 
                to="/shop" 
                className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive('/shop') ? 'text-[#39ff14] border-b-2 border-[#39ff14] pb-1' : 'text-gray-300 hover:text-white'}`}
              >
                Marketplace
              </Link>
              {isAuthenticated && user?.is_organizer && (
                <Link 
                  to="/crm" 
                  className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive('/crm') ? 'text-[#39ff14] border-b-2 border-[#39ff14] pb-1' : 'text-gray-300 hover:text-white'}`}
                >
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-6">
              <button className="text-gray-300 hover:text-white transition-colors">
                <Search size={20} />
              </button>
              <Link to="/cart" className="text-gray-300 hover:text-white transition-colors relative">
                <ShoppingBag size={20} />
                {/* Optional: Cart badge */}
                {/* <span className="absolute -top-1 -right-1 bg-[#39ff14] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span> */}
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400 hidden sm:block">{user?.first_name || user?.email}</span>
                  <button 
                    onClick={handleLogout} 
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 px-5 py-2 rounded text-xs uppercase tracking-wider font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-[#39ff14] hover:bg-[#32e612] text-black transition-all duration-300 px-6 py-2.5 rounded text-xs uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>

      <footer className="bg-[#050505] border-t border-white/5 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-xs tracking-widest uppercase">© 2026 SPOITHUB MVP. SYSTEM ONLINE.</p>
        </div>
      </footer>
    </div>
  );
};
