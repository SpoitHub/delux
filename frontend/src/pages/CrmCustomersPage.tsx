import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Mail, User, Eye } from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', orders: 12, totalSpent: '$3,420', joined: 'Jan 2024', lastOrder: 'Oct 24, 2024' },
  { id: 2, name: 'Sarah Smith', email: 'sarah.s@example.com', orders: 8, totalSpent: '$2,150', joined: 'Feb 2024', lastOrder: 'Oct 23, 2024' },
  { id: 3, name: 'Mike Brown', email: 'mike.b@example.com', orders: 5, totalSpent: '$980', joined: 'Mar 2024', lastOrder: 'Oct 22, 2024' },
  { id: 4, name: 'Emma Davis', email: 'emma.d@example.com', orders: 15, totalSpent: '$5,600', joined: 'Jan 2024', lastOrder: 'Oct 24, 2024' },
  { id: 5, name: 'James Wilson', email: 'james.w@example.com', orders: 3, totalSpent: '$450', joined: 'May 2024', lastOrder: 'Oct 20, 2024' },
  { id: 6, name: 'Olivia Martinez', email: 'olivia.m@example.com', orders: 9, totalSpent: '$2,870', joined: 'Feb 2024', lastOrder: 'Oct 21, 2024' },
  { id: 7, name: 'William Garcia', email: 'william.g@example.com', orders: 1, totalSpent: '$120', joined: 'Oct 2024', lastOrder: 'Oct 19, 2024' },
  { id: 8, name: 'Sophia Lee', email: 'sophia.l@example.com', orders: 22, totalSpent: '$8,900', joined: 'Dec 2023', lastOrder: 'Oct 24, 2024' },
];

export const CrmCustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">CUSTOMERS</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">View and manage your customer base</p>
        </div>
        <button className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-colors flex items-center gap-2">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Total Customers</h3>
          <div className="text-2xl font-black text-white">{MOCK_CUSTOMERS.length}</div>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Total Orders</h3>
          <div className="text-2xl font-black text-white">{MOCK_CUSTOMERS.reduce((s, c) => s + c.orders, 0)}</div>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Avg. per Customer</h3>
          <div className="text-2xl font-black text-[#39ff14]">
            {(MOCK_CUSTOMERS.reduce((s, c) => s + c.orders, 0) / MOCK_CUSTOMERS.length).toFixed(1)} orders
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="SEARCH CUSTOMERS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#39ff14] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Customer</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Orders</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Total Spent</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Joined</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Last Order</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#39ff14]/10 flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-[#39ff14]" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-bold">{customer.name}</div>
                        <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm font-bold">{customer.orders}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm font-black">{customer.totalSpent}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-400 text-xs font-bold">{customer.joined}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-400 text-xs font-bold">{customer.lastOrder}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to="/crm/orders" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="View orders">
                        <Eye size={16} />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-[#39ff14] hover:bg-[#39ff14]/10 rounded-lg transition-colors" title="Send email">
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 text-sm">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs font-bold tracking-widest uppercase text-gray-500">
          <span>Showing 1 to {filtered.length} of {MOCK_CUSTOMERS.length} entries</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50">Prev</button>
            <button className="px-4 py-2 rounded-lg bg-[#39ff14] text-black hover:bg-[#32e612] transition-colors">1</button>
            <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};