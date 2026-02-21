import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store';
import { LayoutDashboard, Calendar, ShoppingBag, ShoppingCart, Users, LogOut, ArrowLeft } from 'lucide-react';

export const OrganizerLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#39ff14] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.is_organizer) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/crm', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/crm/events', label: 'Events', icon: Calendar },
    { path: '/crm/products', label: 'Products', icon: ShoppingBag },
    { path: '/crm/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/crm/customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-[#050505] text-white font-sans selection:bg-[#39ff14] selection:text-black">
      {/* Sidebar */}
      <div className="w-64 bg-[#111] border-r border-white/5 flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link to="/crm" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-[#39ff14] rounded-sm flex items-center justify-center transform -skew-x-12 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.3)]">
              <span className="text-black font-black text-xl italic">S</span>
            </div>
            <span className="text-xl font-black tracking-tighter">
              SPOIT<span className="text-[#39ff14]">HUB</span>
              <span className="block text-[8px] text-gray-500 tracking-widest uppercase mt-0.5">Organizer</span>
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/crm' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#39ff14]' : 'text-gray-500'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
          >
            <ArrowLeft size={16} className="text-gray-500" />
            Back to Site
          </Link>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-[#111]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
          <h1 className="text-sm font-bold tracking-widest uppercase text-gray-400">
            {navItems.find(item => location.pathname === item.path || (item.path !== '/crm' && location.pathname.startsWith(item.path)))?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-[#39ff14]">
                {(user.first_name?.[0] || user.email?.[0] || 'O').toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-white hidden sm:block">
              {user.first_name || user.email}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-[#050505]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
