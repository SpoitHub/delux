import { Link } from 'react-router-dom';
import { Users, Calendar, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useDashboard, useCrmOrders } from '../features/crm/hooks';

export const CrmDashboardPage = () => {
  const { data: stats, isLoading: isStatsLoading } = useDashboard();
  const { data: recentOrders = [], isLoading: isOrdersLoading } = useCrmOrders();

  const STATS = [
    {
      title: 'Total Revenue',
      value: isStatsLoading ? '...' : `$${Number(stats?.revenue || 0).toLocaleString()}`,
      change: '+14.5%', // Mocking change for now as backend doesn't provide historical data yet
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'Active Events',
      value: isStatsLoading ? '...' : String(stats?.events_count || 0),
      change: '+2',
      isPositive: true,
      icon: Calendar,
    },
    {
      title: 'Orders',
      value: isStatsLoading ? '...' : String(stats?.orders_count || 0),
      change: '+5.2%',
      isPositive: true,
      icon: ShoppingBag,
    },
    {
      title: 'Total Customers',
      value: isStatsLoading ? '...' : String(stats?.customers_count || 0),
      change: '+22.4%',
      isPositive: true,
      icon: Users,
    },
  ];

  const displayOrders = recentOrders.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
            OVERVIEW
          </h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <button className="bg-[#39ff14] text-black px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)]">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-[#39ff14]/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon size={20} className="text-[#39ff14]" />
                </div>
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${
                  stat.isPositive ? 'bg-[#39ff14]/10 text-[#39ff14]' : 'bg-red-500/10 text-red-500'
                }`}>
                  {stat.isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">{stat.title}</h3>
              <div className="text-3xl font-black text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts & Tables Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase">Revenue Overview</h3>
            <select className="bg-white/5 border border-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-lg px-3 py-2 outline-none focus:border-[#39ff14]">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {/* Mock Bar Chart */}
            {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
              <div key={i} className="w-full bg-white/5 rounded-t-md relative group">
                <div 
                  className="absolute bottom-0 w-full bg-[#39ff14] rounded-t-md transition-all duration-500 group-hover:bg-[#32e612]"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-gray-500 text-[10px] font-bold tracking-widest uppercase">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase">Recent Orders</h3>
            <Link to="/crm/orders" className="text-[#39ff14] text-xs font-bold tracking-widest uppercase hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {isOrdersLoading ? (
              <div className="text-gray-500 text-xs font-bold tracking-widest uppercase">Loading orders...</div>
            ) : displayOrders.length === 0 ? (
              <div className="text-gray-500 text-xs font-bold tracking-widest uppercase">No recent orders</div>
            ) : (
              displayOrders.map((order, i) => (
                <Link key={i} to={`/crm/orders/${order.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                  <div>
                    <div className="text-white text-sm font-bold mb-1">{order.contact.name}</div>
                    <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                      {order.items.length} item(s)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#39ff14] text-sm font-black mb-1">${Number(order.total).toFixed(2)}</div>
                    <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};