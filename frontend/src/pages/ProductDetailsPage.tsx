import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Star, Minus, Plus, Package, Check } from 'lucide-react';
import { useProduct } from '../features/products/hooks';
import { useAddToCart } from '../features/cart/hooks';
import { formatPrice } from '../shared/lib/formatters';
import { PageSpinner } from '../shared/ui/Spinner';
import { EmptyState } from '../shared/ui/EmptyState';
import { useToast } from '../shared/ui/toast-context';

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id!);
  const addToCart = useAddToCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) return <PageSpinner />;

  if (isError || !product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="It may have been removed or the link is invalid"
        actionLabel="Back to Shop"
        actionTo="/shop"
      />
    );
  }

  const images = product.images?.length ? product.images : [];
  const currentImage = images[selectedImage]?.image;
  const inStock = product.stock_quantity > 0;

  const handleAddToCart = () => {
    addToCart.mutate(
      { item_type: 'product', product_id: product.id, quantity },
      {
        onSuccess: () => toast('Product added to cart', 'success'),
        onError: () => toast('Failed to add product', 'error'),
      }
    );
  };

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Back Link */}
      <Link to="/shop" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase mb-8 transition-colors w-fit">
        <ArrowLeft size={14} />
        Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden h-96 md:h-[500px] flex items-center justify-center p-8">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.title}
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            ) : (
              <ShoppingBag size={64} className="text-white/10" />
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          {product.category && (
            <span className="inline-block bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            {product.title}
          </h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(product.rating!)
                        ? 'text-[#39ff14] fill-[#39ff14]'
                        : 'text-gray-600'
                    }
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm font-bold">{product.rating}</span>
            </div>
          )}

          {/* Price */}
          <div className="text-4xl font-black text-[#39ff14]">
            {formatPrice(product.price)}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {inStock ? (
              <>
                <Check size={16} className="text-green-400" />
                <span className="text-green-400 text-sm font-bold">In Stock ({product.stock_quantity} pcs.)</span>
              </>
            ) : (
              <>
                <Package size={16} className="text-red-400" />
                <span className="text-red-400 text-sm font-bold">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-3">Description</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {/* Add to Cart */}
          {inStock && (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">Quantity</span>
                <div className="flex items-center bg-white/5 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 text-white font-bold text-lg min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(quantity + 1, product.stock_quantity))}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="w-full bg-[#39ff14] hover:bg-[#32e612] text-black font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <ShoppingBag size={18} />
                Add to Cart — {formatPrice(product.price * quantity)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};