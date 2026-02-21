import { useState } from 'react';
import { Search, Eye, Download, Filter } from 'lucide-react';

const MOCK_ORDERS = [
  { id: 'ORD-1042', customer: 'Alex Johnson', email: 'alex.j@example.com', items: '2x Pro Elite Jersey', total: '$240.00', status: 'Completed', date: 'Oct 24, 2024 14:30' },
  { id: 'ORD-1043', customer: 'Sarah Smith', email: 'sarah.s@example.com', items: '1x UFC 300 VIP Ticket', total: '$800.00', status: 'Processing', date: 'Oct 24, 2024 15:45' },
  { id: 'ORD-1044', customer: 'Mike Brown', email: 'mike.b@example.com', items: '1x Carbon Cleats', total: '$250.00', status: 'Completed', date: 'Oct 24, 2024 16:10' },
  { id: 'ORD-1045', customer: 'Emma Davis', email: 'emma.d@example.com', items: '2x NBA Finals Ticket', total: '$2400.00', status: 'Pending', date: 'Oct 24, 2024 17:20' },
  { id: 'ORD-1046', customer: 'James Wilson', email: 'james.w@example.com', items: '1x Performance Hoodie', total: '$85.00', status: 'Cancelled', date: 'Oct 24, 2024 18:05' },
];

export const CrmOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">ORDERS</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Track and manage customer orders</p>
        </div>
        <button className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-colors flex items-center gap-2">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="SEARCH ORDERS, CUSTOMERS..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#39ff14] transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="bg-white/5 border border-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-xl px-4 py-3 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
            <Filter size={14} />
            Filter
          </button>
          <select className="bg-white/5 border border-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-xl px-4 py-3 outline-none focus:border-[#39ff14] w-full md:w-auto">
            <option>All Status</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Order ID & Date</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Customer</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Items</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Total</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Status</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="text-white text-sm font-bold mb-1">{order.id}</div>
                    <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">{order.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm font-bold">{order.customer}</div>
                    <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">{order.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-300 text-xs font-bold">{order.items}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm font-black">{order.total}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                      order.status === 'Completed' ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' :
                      order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-[#39ff14] hover:bg-[#39ff14]/10 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs font-bold tracking-widest uppercase text-gray-500">
          <span>Showing 1 to 5 of 124 entries</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50">Prev</button>
            <button className="px-4 py-2 rounded-lg bg-[#39ff14] text-black hover:bg-[#32e612] transition-colors">1</button>
            <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition-colors">2</button>
            <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition-colors">3</button>
            <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};