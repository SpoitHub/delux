import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Package, Image, X } from 'lucide-react';
import { useToast } from '../shared/ui/toast-context';
import { useCreateCrmProduct } from '../features/crm/hooks';
import { CategorySelect } from '../shared/ui/CategorySelect';

type FormErrors = Record<string, string>;

export const CrmProductCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createProduct = useCreateCrmProduct();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = 'Product name is required.';
    if (!description.trim()) errs.description = 'Description is required.';
    if (!price || isNaN(Number(price)) || Number(price) < 0) errs.price = 'Valid price is required.';
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) errs.stock = 'Valid stock quantity is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createProduct.mutateAsync({
        title,
        description,
        price,
        stock_quantity: stock,
        category_id: categoryId ? Number(categoryId) : null,
        is_active: isActive,
        image: imageFile,
      });
      toast('Product created successfully!', 'success');
      navigate('/crm/products');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Failed to create product.';
      toast(msg, 'error');
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] transition-colors text-sm';
  const errorInputClass =
    'w-full bg-white/5 border border-red-500/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors text-sm';
  const labelClass = 'block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest';

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        to="/crm/products"
        className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors w-fit"
      >
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
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2 mb-2">
              <Package size={16} className="text-[#39ff14]" />
              Product Details
            </h2>

            {/* Title */}
            <div>
              <label htmlFor="product-name" className={labelClass}>Product Name *</label>
              <input
                id="product-name"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pro Training Shoes X9"
                className={errors.title ? errorInputClass : inputClass}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="product-description" className={labelClass}>Description *</label>
              <textarea
                id="product-description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product..."
                className={(errors.description ? errorInputClass : inputClass) + ' resize-none'}
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Price / Stock / Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="product-price" className={labelClass}>Price (KZT) *</label>
                <input
                  id="product-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  className={errors.price ? errorInputClass : inputClass}
                />
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="product-stock" className={labelClass}>Stock Quantity *</label>
                <input
                  id="product-stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  min="0"
                  className={errors.stock ? errorInputClass : inputClass}
                />
                {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock}</p>}
              </div>
              <div>
                <label htmlFor="product-category" className={labelClass}>Category</label>
                <CategorySelect
                  value={categoryId}
                  onChange={setCategoryId}
                />
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
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-black transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#39ff14]/30 transition-colors cursor-pointer"
              >
                <Image size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-xs font-bold">Click to upload</p>
                <p className="text-gray-600 text-[10px] mt-1">PNG, JPG up to 5MB</p>
              </button>
            )}
            {imagePreview && (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full mt-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold tracking-widest uppercase rounded-xl py-2 hover:bg-white/10 transition-colors"
              >
                Change Image
              </button>
            )}
          </div>

          {/* Active toggle */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white text-sm font-bold tracking-widest uppercase">Active</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#39ff14] transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
            <p className="text-gray-500 text-[10px] mt-2 tracking-wider">
              {isActive ? 'Product is visible in the shop' : 'Product is hidden from the shop'}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createProduct.isPending}
            className="w-full bg-[#39ff14] text-black px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {createProduct.isPending ? 'Saving...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};