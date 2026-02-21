import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-[80vh] w-full">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between mt-12 lg:mt-24 gap-12">
        
        {/* Left Content */}
        <div className="flex-1 space-y-8 max-w-2xl">
          <div className="inline-block border border-[#39ff14] rounded-full px-4 py-1">
            <span className="text-[#39ff14] text-[10px] font-bold tracking-widest uppercase">The Future of Sports</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            <span className="text-white block">UNLEASH</span>
            <span className="text-[#39ff14] block">ADRENALINE</span>
          </h1>
          
          <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
            Experience the next generation of sports events. Join the revolution where physical prowess meets digital innovation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/events/new" 
              className="bg-[#39ff14] hover:bg-[#32e612] text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-all duration-300 text-center shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
            >
              Create Event
            </Link>
            <Link 
              to="/events" 
              className="bg-transparent border border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14]/10 font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-all duration-300 text-center"
            >
              View Catalog
            </Link>
          </div>
        </div>

        {/* Right Content - Stats Cards */}
        <div className="flex-1 w-full max-w-md relative">
          {/* Live Events Card */}
          <div className="absolute -top-12 right-0 md:-right-12 bg-[#111] border border-white/5 rounded-2xl p-6 w-64 shadow-2xl z-20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Live Events</span>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>
            <div className="text-4xl font-black text-white mb-2">124</div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#39ff14] w-[70%] h-full"></div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="absolute top-32 left-0 md:-left-12 bg-[#111] border border-white/5 rounded-2xl p-6 w-64 shadow-2xl z-10">
            <div className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-2">Active Users</div>
            <div className="text-3xl font-black text-white mb-4">8.5K</div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#111]"></div>
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#111] flex items-center justify-center text-[10px] font-bold text-white">
                +2k
              </div>
            </div>
          </div>

          {/* Total Sales Card */}
          <div className="absolute top-72 right-12 md:right-0 bg-[#111] border border-white/5 rounded-2xl p-6 w-64 shadow-2xl z-20">
            <div className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-2">Total Sales</div>
            <div className="text-4xl font-black text-[#39ff14] mb-3">$1.2M</div>
            <div className="inline-flex items-center bg-[#39ff14]/10 text-[#39ff14] text-[10px] font-bold px-2 py-1 rounded">
              <span className="mr-1">▲</span> +18%
            </div>
          </div>
          
          {/* Background decorative circle for cards */}
          <div className="absolute top-24 right-12 w-64 h-64 border border-white/5 rounded-full"></div>
        </div>
      </div>

      {/* Trending Events Section */}
      <div className="mt-48 mb-24">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
            <span className="text-white">TRENDING </span>
            <span className="text-[#39ff14]">EVENTS</span>
          </h2>
          <Link to="/events" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center transition-colors">
            View All <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        
        {/* Placeholder for event cards - will be populated by EventsListPage components later */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
