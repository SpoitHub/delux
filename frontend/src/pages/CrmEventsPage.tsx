import { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_EVENTS = [
  { id: 'EVT-001', title: 'Champions League Final', date: '28 May 2024', location: 'Wembley Stadium', status: 'Active', ticketsSold: 85000, revenue: '$4.2M' },
  { id: 'EVT-002', title: 'UFC 300', date: '13 Apr 2024', location: 'T-Mobile Arena', status: 'Active', ticketsSold: 18000, revenue: '$2.1M' },
  { id: 'EVT-003', title: 'NBA Finals Game 7', date: '20 Jun 2024', location: 'TD Garden', status: 'Draft', ticketsSold: 0, revenue: '$0' },
  { id: 'EVT-004', title: 'Wimbledon Men\'s Final', date: '14 Jul 2024', location: 'All England Club', status: 'Completed', ticketsSold: 15000, revenue: '$1.5M' },
];

export const CrmEventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">EVENTS</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Manage your upcoming and past events</p>
        </div>
        <Link 
          to="/crm/events/new" 
          className="bg-[#39ff14] text-black px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center gap-2"
        >
          <Plus size={16} />
          Create Event
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="SEARCH EVENTS..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#39ff14] transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-white/5 border border-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-xl px-4 py-3 outline-none focus:border-[#39ff14] w-full md:w-auto">
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Event ID</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Title</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Date & Location</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Status</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Sales</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EVENTS.map((event) => (
                <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-gray-500 text-xs font-bold tracking-widest uppercase">{event.id}</td>
                  <td className="p-4">
                    <div className="text-white text-sm font-bold">{event.title}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-300 text-xs font-bold mb-1">{event.date}</div>
                    <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">{event.location}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                      event.status === 'Active' ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' :
                      event.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm font-black">{event.revenue}</div>
                    <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">{event.ticketsSold.toLocaleString()} Tickets</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#39ff14] hover:bg-[#39ff14]/10 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
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
          <span>Showing 1 to 4 of 4 entries</span>
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