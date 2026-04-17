import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCartStore } from '../store/cartStore';
import { Star, ChevronRight, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Category() {
  const { name } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resFoods, resRests] = await Promise.all([
          api.get('/foods'),
          api.get('/restaurants')
        ]);
        
        const allFoods = resFoods.data;
        const allRests = resRests.data;

        // Filter foods by category name
        const categoryFoods = allFoods.filter(f => 
          f.category.toLowerCase() === name.toLowerCase() || 
          f.name.toLowerCase().includes(name.toLowerCase())
        );

        setFoods(categoryFoods);
        setRestaurants(allRests);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [name]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans min-h-screen bg-white">
      {/* Header section */}
      <div className="mb-8 border-b pb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{name}</h1>
        <p className="text-gray-500 text-lg">
          Satisfy your cravings with these fluffy & flavoursome choices of {name}.
        </p>
      </div>

      {/* Varieties Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Varieties of {name}</h2>
        {loading ? (
          <p className="text-gray-500 py-4">Loading varieties...</p>
        ) : foods.length === 0 ? (
          <p className="text-gray-500 py-4">No specific items found for this category right now. Explore the restaurants below!</p>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {foods.map((item, index) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row p-4 gap-4 group"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                    <p className="font-semibold text-gray-900 mb-2">₹{item.price}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                       <Clock size={14} className="text-orange-400" />
                       <span>{item.deliveryTime}</span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 italic">"{item.description || `Fresh and delicious ${item.name}`}"</p>
                  </div>
                  <div className="relative w-full sm:w-32 h-32 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl shadow-inner shadow-black/5" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-full flex justify-center">
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.preventDefault(); addToCart(item); }}
                        className="bg-white text-green-600 border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors px-6 py-2 rounded-xl text-sm font-extrabold uppercase shadow-md"
                      >
                        ADD
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Restaurants Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurants serving {name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8 mb-10">
        {loading ? (
          <div className="col-span-full py-10 text-center text-gray-500">Loading restaurants...</div>
        ) : restaurants.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-500">No restaurants found.</div>
        ) : (
          restaurants.map((rest, index) => (
            <motion.div
              key={rest._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (index * 0.05) }}
            >
              <Link to={`/restaurant/${rest._id}`} className="block group">
                <div className="relative h-48 sm:h-56 overflow-hidden rounded-2xl shadow-sm group-hover:shadow-xl transition-all">
                  <img src={rest.image} alt={rest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                  {rest.discountToken && (
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="absolute bottom-3 left-3 text-white font-black text-lg sm:text-xl tracking-tight leading-tight"
                    >
                      {rest.discountToken}
                    </motion.div>
                  )}
                </div>
                <div className="pt-3 px-1">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors leading-none mb-1">{rest.name}</h3>
                  <div className="flex items-center text-gray-700 font-bold text-sm mb-1 mt-1.5">
                    <span className="flex items-center justify-center bg-green-700 text-white rounded-full w-5 h-5 mr-1.5 shadow-sm">
                      <Star size={10} fill="white" />
                    </span>
                    {rest.rating} <span className="mx-1 text-gray-400 font-normal">•</span> {rest.distance}
                  </div>
                  <p className="text-gray-500 text-[13px] truncate">{rest.cuisines?.join(', ')}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-[12px] mt-1">
                    <MapPin size={12} />
                    <p className="truncate">{rest.location}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}

      </div>
    </div>
  );
}
