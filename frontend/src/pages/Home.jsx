import { Link } from 'react-router-dom';
import { categories } from '../data/mockData';
import { ChevronLeft, ChevronRight, Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center md:text-left"
          >
            <h2 className="text-6xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-8">
              Craving something <span className="text-orange-500 italic block mt-2">delicious?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-500 mb-12 max-w-xl mx-auto md:mx-0 font-medium leading-relaxed">
              Premium local food delivered to your doorstep in minutes. Experience the <span className="text-orange-600 font-bold">FlavorSync</span> speed.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 bg-orange-500 p-8 rounded-[2.5rem] shadow-2xl shadow-orange-200"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                  <input 
                    type="text" 
                    placeholder="Search for restaurant, item or more" 
                    className="w-full pl-6 pr-14 py-5 bg-white rounded-2xl text-gray-700 font-semibold shadow-inner focus:ring-4 focus:ring-white/20 outline-none transition-all placeholder:text-gray-400"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                    <Search size={22} />
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: '#000' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest"
                >
                  Find Food
                </motion.button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-white/90 text-sm font-bold ml-2">
                <MapPin size={16} />
                <span>India</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="flex-1 w-full"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-square md:aspect-[4/5] bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center group">
              <span className="text-[12rem] md:text-[15rem] drop-shadow-2xl group-hover:scale-110 transition-transform duration-700">🍕</span>
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white font-black text-3xl">Get 50% OFF<br/><span className="text-orange-300 text-xl font-bold">On your first order</span></p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* What's on your mind? Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Ankit, what's on your mind?</h3>
            <div className="flex gap-3">
              <button className="p-3 rounded-full bg-gray-100 hover:bg-orange-100 hover:text-orange-600 transition-all text-gray-600 shadow-sm">
                <ChevronLeft size={24} />
              </button>
              <button className="p-3 rounded-full bg-gray-100 hover:bg-orange-100 hover:text-orange-600 transition-all text-gray-600 shadow-sm">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-8 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
              >
                <Link 
                  to={`/category/${encodeURIComponent(category.name)}`}
                  className="flex flex-col items-center flex-shrink-0 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className="w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-lg mb-4 border-4 border-white group-hover:border-orange-500 transition-all duration-300 ring-1 ring-gray-100"
                  >
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
                    />
                  </motion.div>
                  <span className="text-lg font-bold text-gray-700 group-hover:text-orange-500 transition-colors tracking-tight">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

