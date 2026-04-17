import { Link } from 'react-router-dom';
import { Search, Star, Clock, MapPin, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { categories } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export default function Menu() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resFoods, resRests] = await Promise.all([
          api.get('/foods'),
          api.get('/restaurants')
        ]);
        setFoods(resFoods.data);
        setRestaurants(resRests.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayedFoods = selectedCategory === 'All' ? foods : foods.filter(f => f.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Categories Section - Swiggy Style "What's on your mind?" */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">What's on your mind?</h2>
          </motion.div>
          <div className="flex overflow-x-auto gap-8 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((category, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category.name)}
                className="flex flex-col items-center flex-shrink-0 group cursor-pointer"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-md mb-4 border-4 transition-all duration-300 ${selectedCategory === category.name ? 'border-orange-500 ring-4 ring-orange-100' : 'border-transparent'}`}
                >
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-gray-50"
                  />
                </motion.div>
                <span className={`text-base font-bold text-center transition-colors ${selectedCategory === category.name ? 'text-orange-500' : 'text-gray-700 group-hover:text-orange-500'}`}>
                  {category.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.hr 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          className="border-gray-100 mb-12" 
        />

        {/* Dynamic View depending on Category selection */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'All' ? (
            <motion.div
              key="all-restaurants"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Top restaurant chains in your location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
                {loading ? (
                  <div className="col-span-full py-20 text-center text-gray-400 font-bold">Discovering the best spots for you...</div>
                ) : (
                  restaurants.map((rest, index) => (
                    <motion.div
                      key={rest._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/restaurant/${rest._id}`} className="block group">
                        <div className="relative h-56 sm:h-64 overflow-hidden rounded-3xl shadow-sm group-hover:shadow-2xl transition-all duration-500">
                          <img src={rest.image} alt={rest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                          {rest.discountToken && (
                            <div className="absolute bottom-4 left-4 text-white font-black text-xl sm:text-2xl tracking-tighter shadow-black drop-shadow-lg">
                              {rest.discountToken}
                            </div>
                          )}
                        </div>
                        <div className="pt-4 px-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors leading-tight mb-2 uppercase tracking-tight">{rest.name}</h3>
                          <div className="flex items-center text-gray-700 font-bold text-sm mb-2">
                            <span className="flex items-center justify-center bg-green-700 text-white rounded-full w-5 h-5 mr-2 shadow-sm">
                              <Star size={10} fill="currentColor" />
                            </span>
                            {rest.rating} <span className="mx-2 text-gray-300">•</span> {rest.distance}
                          </div>
                          <p className="text-gray-400 text-sm font-medium truncate mb-1">{rest.cuisines?.join(', ')}</p>
                          <div className="flex items-center text-gray-400 text-xs font-semibold">
                             <MapPin size={12} className="mr-1" />
                             <span className="truncate">{rest.location}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="category-items"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-orange-500"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Explore {selectedCategory}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  <div className="col-span-full py-20 text-center text-gray-400 font-bold">Gathering {selectedCategory} varieties...</div>
                ) : displayedFoods.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-400 font-bold">No {selectedCategory} items found right now.</div>
                ) : (
                  displayedFoods.map((item, index) => (
                    <motion.div 
                      key={item._id} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-3xl overflow-hidden group border border-gray-100 hover:shadow-2xl transition-all flex flex-col sm:flex-row p-5 gap-6"
                    >
                      <div className="flex-1">
                        <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center rounded-sm mb-3">
                           <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                        </div>
                        <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-orange-500 transition-colors tracking-tight uppercase">{item.name}</h3>
                        <p className="font-black text-gray-900 text-lg mb-3">₹{item.price}</p>
                        <div className="flex items-center text-gray-400 text-xs font-bold gap-3">
                           <div className="flex items-center gap-1">
                              <ShoppingBag size={12} className="text-orange-400" />
                              <span>{item.restaurant}</span>
                           </div>
                           <div className="flex items-center gap-1">
                              <Clock size={12} className="text-orange-400" />
                              <span>{item.deliveryTime}</span>
                           </div>
                        </div>
                      </div>
                      <div className="relative w-full sm:w-36 h-36 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-[2rem] shadow-lg group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center">
                          <motion.button 
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.preventDefault(); addToCart(item); }}
                            className="bg-white text-green-600 border-2 border-gray-100 hover:border-green-500 hover:shadow-xl px-8 py-3 rounded-2xl text-xs font-black uppercase transition-all"
                          >
                            ADD
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
