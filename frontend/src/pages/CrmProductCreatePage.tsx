import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Package, Image } from 'lucide-react';
import { useToast } from '../shared/ui/toast-context';
import { MOCK_CATEGORIES } from '../shared/api/mock-data';

export const CrmProductCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: globalThis.Event | { preventDefault: () => void }) => {
    e.preventDefault();
    toast('Product created successfully!', 'success');
    navigate('/crm/products');
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] transition-colors text-sm';
  const labelClass = 'block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest';

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link to="/crm/products" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors w-fit">
        <ArrowLeft size={14} />
        Back to Products
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white mb-1">ADD PRODUCT</h1>
        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Add a new item to your merchandise catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2 mb-2">
              <Package size={16} className="text-[#39ff14]" />
              Product Details
            </h2>
            <div>
              <label htmlFor="product-name" className={labelClass}>Product Name</label>
              <input id="product-name" type="text" placeholder="e.g. Pro Training Shoes X9" className={inputClass} required />
            </div>
            <div>
              <label htmlFor="product-description" className={labelClass}>Description</label>
              <textarea id="product-description" rows={5} placeholder="Describe the product..." className={inputClass + ' resize-none'} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="product-price" className={labelClass}>Price (KZT)</label>
                <input id="product-price" type="number" placeholder="0" min="0" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="product-stock" className={labelClass}>Stock Quantity</label>
                <input id="product-stock" type="number" placeholder="0" min="0" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="product-category" className={labelClass}>Category</label>
                <select id="product-category" className="w-full bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#39ff14]">
                  {MOCK_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <Image size={16} className="text-[#39ff14]" />
              Product Image
            </h3>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#39ff14]/30 transition-colors cursor-pointer">
              <Image size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 text-xs font-bold">Click to upload</p>
              <p className="text-gray-600 text-[10px] mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white text-sm font-bold tracking-widest uppercase">Active</span>
              <div className="relative">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#39ff14] transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#39ff14] text-black px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};