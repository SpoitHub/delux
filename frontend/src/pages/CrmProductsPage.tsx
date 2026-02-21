import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PRODUCTS = [
  { id: 'PRD-001', name: 'Pro Elite Jersey', category: 'Apparel', price: '$120', stock: 450, status: 'In Stock', sales: 1240 },
  { id: 'PRD-002', name: 'Carbon Fiber Cleats', category: 'Footwear', price: '$250', stock: 12, status: 'Low Stock', sales: 850 },
  { id: 'PRD-003', name: 'Performance Hoodie', category: 'Apparel', price: '$85', stock: 0, status: 'Out of Stock', sales: 2100 },
  { id: 'PRD-004', name: 'Smart Tracker Watch', category: 'Accessories', price: '$300', stock: 85, status: 'In Stock', sales: 420 },
];

export const CrmProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">PRODUCTS</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Manage your merchandise inventory</p>
        </div>
        <Link 
          to="/crm/products/new" 
          className="bg-[#39ff14] text-black px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="SEARCH PRODUCTS..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#39ff14] transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-white/5 border border-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-xl px-4 py-3 outline-none focus:border-[#39ff14] w-full md:w-auto">
            <option>All Categories</option>
            <option>Apparel</option>
            <option>Footwear</option>
            <option>Accessories</option>
          </select>
          <select className="bg-white/5 border border-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-xl px-4 py-3 outline-none focus:border-[#39ff14] w-full md:w-auto">
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Product ID</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Name & Category</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Price</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Stock Status</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Total Sales</th>
                <th className="p-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PRODUCTS.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-gray-500 text-xs font-bold tracking-widest uppercase">{product.id}</td>
                  <td className="p-4">
                    <div className="text-white text-sm font-bold">{product.name}</div>
                    <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">{product.category}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm font-black">{product.price}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                        product.status === 'In Stock' ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' :
                        product.status === 'Low Stock' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {product.status}
                      </span>
                      <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                        ({product.stock} left)
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm font-bold">{product.sales.toLocaleString()}</div>
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