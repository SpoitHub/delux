import { useState } from 'react';
import { Search, Filter, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data based on the screenshot
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'CHAMPIONS LEAGUE FINAL',
    category: 'Football',
    date: '28 MAY 2024',
    location: 'Wembley Stadium, London',
    price: '$450',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 2,
    title: 'UFC 300: MCGREGOR VS CHANDLER',
    category: 'Boxing',
    date: '13 APR 2024',
    location: 'T-Mobile Arena, Las Vegas',
    price: '$800',
    image: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=800&auto=format&fit=crop',
    featured: false
  },
  {
    id: 3,
    title: 'NBA FINALS GAME 7',
    category: 'Basketball',
    date: '20 JUN 2024',
    location: 'TD Garden, Boston',
    price: '$1200',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop',
    featured: false
  },
  {
    id: 4,
    title: 'WIMBLEDON MEN\'S FINAL',
    category: 'Tennis',
    date: '14 JUL 2024',
    location: 'All England Club, London',
    price: '$600',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop',
    featured: false
  }
];

const CATEGORIES = ['All', 'Football', 'Basketball', 'Tennis', 'Boxing', 'Motorsport'];

export const EventsListPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="flex flex-col w-full min-h-screen pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 mt-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
            <span className="text-white block">DISCOVER</span>
            <span className="text-[#39ff14] block">EVENTS</span>
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder="SEARCH EVENTS, TEAMS, VENUES..." 
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EVENTS.map((event) => (
          <Link 
            to={`/events/${event.id}`} 
            key={event.id}
            className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#39ff14]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] flex flex-col"
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                <span className="text-[#39ff14] text-[10px] font-bold tracking-widest uppercase">{event.category}</span>
              </div>
              
              {/* Price Badge */}
              <div className="absolute top-4 right-4 z-20 bg-[#39ff14] text-black px-3 py-1 rounded-full font-black text-sm">
                {event.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-white mb-4 tracking-tight group-hover:text-[#39ff14] transition-colors line-clamp-2">
                {event.title}
              </h3>
              
              <div className="space-y-3 mt-auto">
                <div className="flex items-center text-gray-400 text-xs font-bold tracking-wider uppercase">
                  <Calendar size={14} className="mr-2 text-[#39ff14]" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-400 text-xs font-bold tracking-wider uppercase">
                  <MapPin size={14} className="mr-2 text-[#39ff14]" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-white text-xs font-bold tracking-widest uppercase">Get Tickets</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#39ff14] group-hover:text-black transition-colors">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};