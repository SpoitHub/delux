import { useState } from 'react';
import { Search, Filter, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for shop
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'PRO ELITE JERSEY',
    category: 'Apparel',
    price: '$120',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?q=80&w=800&auto=format&fit=crop',
    isNew: true
  },
  {
    id: 2,
    name: 'CARBON FIBER CLEATS',
    category: 'Footwear',
    price: '$250',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
    isNew: false
  },
  {
    id: 3,
    name: 'PERFORMANCE HOODIE',
    category: 'Apparel',
    price: '$85',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    isNew: false
  },
  {
    id: 4,
    name: 'SMART TRACKER WATCH',
    category: 'Accessories',
    price: '$300',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    isNew: true
  }
];

const CATEGORIES = ['All', 'Apparel', 'Footwear', 'Accessories', 'Equipment'];

export const ProductsListPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="flex flex-col w-full min-h-screen pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 mt-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
            <span className="text-white block">PREMIUM</span>
            <span className="text-[#39ff14] block">GEAR</span>
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder="SEARCH PRODUCTS..." 
            className="w-full bg-[#111] border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-full py-4 pl-12 pr-4 focus:outline-none focus:border-[#39ff14] transition-colors"
          />
          <button className="absolute inset-y-2 right-2 bg-[#39ff14] text-black p-2 rounded-full hover:bg-[#32e612] transition-colors">
            <Filter size={14} />
          </button>
        </div>
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
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <Link 
            to={`/shop/${product.id}`} 
            key={product.id}
            className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#39ff14]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] flex flex-col"
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden bg-white/5 p-6 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
              />
              
              {/* New Badge */}
              {product.isNew && (
                <div className="absolute top-4 left-4 z-20 bg-[#39ff14] text-black px-3 py-1 rounded-full">
                  <span className="text-[10px] font-black tracking-widest uppercase">NEW</span>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">{product.category}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-black text-white tracking-tight group-hover:text-[#39ff14] transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </div>
              
              <div className="flex items-center mb-4">
                <Star size={12} className="text-[#39ff14] fill-[#39ff14] mr-1" />
                <span className="text-gray-400 text-xs font-bold">{product.rating}</span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-2xl font-black text-white">{product.price}</span>
                <button className="w-10 h-10 rounded-full bg-[#39ff14] flex items-center justify-center text-black hover:bg-[#32e612] transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                  <ShoppingBag size={16} />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};