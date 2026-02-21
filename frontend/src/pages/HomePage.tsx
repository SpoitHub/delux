import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12">
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-lg">
          Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Future</span> of Events
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover exclusive events, secure your tickets, and shop premium merchandise in a seamless, next-generation digital experience.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <Link to="/events" className="group relative px-8 py-4 bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_40px_rgba(0,243,255,0.8)] transition-all duration-300">
          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -ml-4"></div>
          Explore Events
        </Link>
        <Link to="/shop" className="group relative px-8 py-4 bg-transparent border border-purple-500 text-purple-400 font-bold uppercase tracking-widest rounded-full overflow-hidden shadow-[0_0_20px_rgba(138,43,226,0.2)] hover:bg-purple-500 hover:text-white hover:shadow-[0_0_40px_rgba(138,43,226,0.6)] transition-all duration-300">
          Browse Shop
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors duration-300 group cursor-pointer">
            <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-500 shadow-[0_0_15px_rgba(0,243,255,0)] group-hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]">
              <span className="text-cyan-500/50 group-hover:text-cyan-400 font-mono">0{i}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
