import { useState } from 'react';
import { Search, Filter, ShoppingBag, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../features/products/hooks';
import { useAddToCart } from '../features/cart/hooks';
import { formatPrice } from '../shared/lib/formatters';
import { ProductCardSkeleton } from '../shared/ui/Skeleton';
import { EmptyState } from '../shared/ui/EmptyState';
import { useToast } from '../shared/ui/toast-context';
import type { ProductFilters } from '../entities/types';

const CATEGORIES = ['All', 'Apparel', 'Footwear', 'Accessories', 'Equipment'];

export const ProductsListPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const addToCart = useAddToCart();

  const filters: ProductFilters = {};
  if (searchQuery) filters.search = searchQuery;
  if (activeCategory !== 'All') filters.category = activeCategory;

  const { data, isLoading, isError } = useProducts(filters);

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(search);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchQuery('');
    setActiveCategory('All');
  };

  const hasActiveFilters = searchQuery || activeCategory !== 'All';
  const products = data?.results ?? [];

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate(
      { item_type: 'product', product_id: productId, quantity: 1 },
      {
        onSuccess: () => toast('Product added to cart', 'success'),
        onError: () => toast('Failed to add product', 'error'),
      }
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
            <span className="text-white block">PRODUCT</span>
            <span className="text-[#39ff14] block">SHOP</span>
          </h1>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH PRODUCTS..."
            className="w-full bg-[#111] border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-full py-4 pl-12 pr-4 focus:outline-none focus:border-[#39ff14] transition-colors"
          />
          <button type="submit" className="absolute inset-y-2 right-2 bg-[#39ff14] text-black p-2 rounded-full hover:bg-[#32e612] transition-colors">
            <Filter size={14} />
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-3 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-300 ${
              activeCategory === category 
                ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
                : 'bg-[#111] text-gray-400 border border-white/5 hover:border-[#39ff14]/50 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <EmptyState
          title="Loading Error"
          description="Could not load the product catalog. Please try again later."
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && products.length === 0 && (
        <EmptyState
          title="No Products Found"
          description={hasActiveFilters ? 'Try adjusting your search criteria' : 'The catalog is empty'}
        />
      )}

      {/* Products Grid */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const primaryImage = product.images?.find((img) => img.is_primary)?.image || product.images?.[0]?.image;

            return (
              <Link 
                to={`/products/${product.id}`} 
                key={product.id}
                className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#39ff14]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-white/5 p-6 flex items-center justify-center">
                  {primaryImage ? (
                    <img 
                      src={primaryImage} 
                      alt={product.title} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
                    />
                  ) : (
                    <ShoppingBag size={48} className="text-white/10" />
                  )}
                  
                  {/* Stock Badge */}
                  {product.stock_quantity <= 0 && (
                    <div className="absolute top-4 left-4 z-20 bg-red-500/90 text-white px-3 py-1 rounded-full">
                      <span className="text-[10px] font-black tracking-widest uppercase">Out of Stock</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  {product.category && (
                    <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                      <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">{product.category.name}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-white tracking-tight group-hover:text-[#39ff14] transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </div>
                  
                  {product.rating && (
                    <div className="flex items-center mb-4">
                      <Star size={12} className="text-[#39ff14] fill-[#39ff14] mr-1" />
                      <span className="text-gray-400 text-xs font-bold">{product.rating}</span>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-2xl font-black text-white">{formatPrice(product.price)}</span>
                    {product.stock_quantity > 0 && (
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={addToCart.isPending}
                        className="w-10 h-10 rounded-full bg-[#39ff14] flex items-center justify-center text-black hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)] disabled:opacity-50"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination info */}
      {data && data.count > 0 && (
        <div className="mt-8 text-center text-gray-500 text-xs font-bold tracking-widest uppercase">
          Showing {products.length} of {data.count}
        </div>
      )}
    </div>
  );
};