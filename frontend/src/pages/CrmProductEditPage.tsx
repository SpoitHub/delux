import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Package, Image, Trash2 } from 'lucide-react';
import { useToast } from '../shared/ui/toast-context';
import { getMockProduct, MOCK_CATEGORIES } from '../shared/api/mock-data';

export const CrmProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = getMockProduct(id ?? '');

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Product Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/crm/products" className="text-[#39ff14] text-xs font-bold tracking-widest uppercase hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: globalThis.Event | { preventDefault: () => void }) => {
    e.preventDefault();
    toast('Product updated successfully!', 'success');
    navigate('/crm/products');
  };

  const handleDelete = () => {
    toast('Product deleted.', 'success');
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">EDIT PRODUCT</h1>
          <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Editing: {product.title}</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-red-500/20 transition-colors flex items-center gap-2"
        >
          <Trash2 size={14} />
          Delete Product
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2 mb-2">
              <Package size={16} className="text-[#39ff14]" />
              Product Details
            </h2>
            <div>
              <label htmlFor="product-name" className={labelClass}>Product Name</label>
              <input id="product-name" type="text" defaultValue={product.title} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="product-description" className={labelClass}>Description</label>
              <textarea id="product-description" rows={5} defaultValue={product.description} className={inputClass + ' resize-none'} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="product-price" className={labelClass}>Price (KZT)</label>
                <input id="product-price" type="number" defaultValue={product.price} min="0" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="product-stock" className={labelClass}>Stock Quantity</label>
                <input id="product-stock" type="number" defaultValue={product.stock_quantity} min="0" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="product-category" className={labelClass}>Category</label>
                <select id="product-category" defaultValue={product.category?.slug} className="w-full bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#39ff14]">
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
          {/* Product Image */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <Image size={16} className="text-[#39ff14]" />
              Product Image
            </h3>
            {product.images[0] ? (
              <img src={product.images[0].image} alt={product.title} className="w-full h-40 object-cover rounded-xl mb-3" />
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
                <Image size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-xs font-bold">No image</p>
              </div>
            )}
            <button type="button" className="w-full mt-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold tracking-widest uppercase rounded-xl py-2 hover:bg-white/10 transition-colors">
              Change Image
            </button>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-2">Rating</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#39ff14]">{product.rating}</span>
                <span className="text-gray-500 text-xs">/5.0</span>
              </div>
            </div>
          )}

          {/* Active toggle */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white text-sm font-bold tracking-widest uppercase">Active</span>
              <div className="relative">
                <input type="checkbox" defaultChecked={product.is_active} className="sr-only peer" />
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};