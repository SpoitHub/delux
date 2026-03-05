import { useRef, useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";
import { useCartStore } from "../../features/cart/store";
import { ShoppingBag, ChevronDown, LogOut, ShoppingCart, LayoutDashboard, User } from "lucide-react";

export const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItemsCount = useCartStore((s) => s.itemsCount);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрыть при клике вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Закрыть при смене маршрута
  useEffect(() => { setDropdownOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Инициалы для аватара
  const initials = user
    ? (user.first_name?.[0] ?? user.email[0]).toUpperCase()
    : "?";

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
                <img src="/logo.png" alt="SpoitHub Logo" className="w-10 h-10 mr-3 rounded-lg object-contain" />
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/events"
                className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive("/events") ? "text-[#39ff14] border-b-2 border-[#39ff14] pb-1" : "text-gray-300 hover:text-white"}`}
              >
                Events
              </Link>
              <Link
                to="/shop"
                className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive("/shop") ? "text-[#39ff14] border-b-2 border-[#39ff14] pb-1" : "text-gray-300 hover:text-white"}`}
              >
                Shop
              </Link>
              {isAuthenticated && user?.is_organizer && (
                <Link
                  to="/crm"
                  className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive("/crm") ? "text-[#39ff14] border-b-2 border-[#39ff14] pb-1" : "text-gray-300 hover:text-white"}`}
                >
                  Panel
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-6">
              <Link
                to="/cart"
                className="text-gray-300 hover:text-white transition-colors relative"
              >
                <ShoppingBag size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#39ff14] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartItemsCount > 9 ? '9+' : cartItemsCount}</span>
                )}
              </Link>

              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Avatar + имя — триггер */}
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2.5 group"
                  >
                    {/* Аватар с инициалами */}
                    <div className="w-9 h-9 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14] text-xs font-black shrink-0">
                      {initials}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-bold text-white leading-tight">
                        {user.first_name
                          ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                          : user.email}
                      </p>
                      <p className="text-[10px] tracking-widest uppercase font-bold leading-tight mt-0.5">
                        {user.is_organizer
                          ? <span className="text-[#39ff14]">Organizer</span>
                          : <span className="text-gray-500">Member</span>}
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-[#111] border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                      {/* Шапка карточки */}
                      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14] text-sm font-black shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {user.first_name
                              ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                              : "—"}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          <span className={`inline-block mt-1 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                            user.is_organizer
                              ? "bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30"
                              : "bg-white/5 text-gray-400 border border-white/10"
                          }`}>
                            {user.is_organizer ? "Organizer" : "Member"}
                          </span>
                        </div>
                      </div>

                      {/* Действия */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User size={15} className="text-gray-500" />
                          My Profile
                        </Link>

                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <ShoppingCart size={15} className="text-gray-500" />
                          My Orders
                        </Link>

                        {user.is_organizer && (
                          <Link
                            to="/crm"
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <LayoutDashboard size={15} className="text-gray-500" />
                            Organizer Panel
                          </Link>
                        )}
                      </div>

                      {/* Выход */}
                      <div className="border-t border-white/5 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-[#050505] border-t border-white/5 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-xs tracking-widest uppercase">
            © 2026 SPOITHUB MVP. SYSTEM ONLINE.
          </p>
        </div>
      </footer>
    </div>
  );
};
