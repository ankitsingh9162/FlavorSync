import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Star, Clock, ArrowLeft, MapPin, Share2, Heart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestaurantDetails() {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRest, resFoods] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/restaurants/${id}/foods`)
        ]);
        setRestaurant(resRest.data);
        setFoods(resFoods.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!restaurant) {
    return <div className="min-h-screen bg-gray-50 py-20 text-center text-xl text-red-500 font-bold">Restaurant not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans pb-20">
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 mt-4">
        
        {/* Breadcrumb / Back Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Home
          </Link>
          <div className="flex gap-4 text-gray-400">
            <Share2 size={20} className="hover:text-orange-500 cursor-pointer transition-colors" />
            <Heart size={20} className="hover:text-red-500 cursor-pointer transition-colors" />
          </div>
        </motion.div>

        {/* Restaurant Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-100 mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-bl-full -z-0 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3 tracking-tighter">{restaurant.name}</h1>
              <p className="text-lg font-bold text-gray-500 mb-4">{restaurant.cuisines?.join(', ')}</p>
              <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-semibold">
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                   <MapPin size={16} className="mr-2 text-orange-500" />
                   <span>{restaurant.location}</span>
                </div>
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                   <Clock size={16} className="mr-2 text-orange-500" />
                   <span>{restaurant.distance}</span>
                </div>
              </div>
            </div>
            
            {/* Rating Box */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white border-2 border-gray-50 rounded-3xl p-5 flex flex-col items-center justify-center shadow-lg min-w-[100px]"
            >
              <div className="flex items-center text-green-700 font-black text-2xl border-b-2 border-gray-50 pb-2 w-full justify-center">
                <Star size={20} fill="currentColor" className="mr-2" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="text-[10px] uppercase text-gray-400 tracking-wider pt-2 font-black">10K+ Ratings</div>
            </motion.div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center text-gray-800 font-bold text-sm">
             <div className="flex -space-x-3 mr-4">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" /></div>)}
             </div>
             <p className="text-gray-500 font-medium">Joined by <span className="text-gray-900 font-bold">500+ people</span> ordering right now</p>
          </div>
        </motion.div>

        {/* Menu Section */}
        <div className="mb-10 flex items-center gap-4">
           <div className="h-[2px] flex-1 bg-gray-100"></div>
           <span className="text-gray-400 font-black tracking-[0.2em] uppercase text-xs">Menu Selection</span>
           <div className="h-[2px] flex-1 bg-gray-100"></div>
        </div>

        <div className="space-y-12">
          {foods.length === 0 ? (
            <p className="text-gray-400 text-center py-20 font-bold italic">No items found on the menu today.</p>
          ) : (
            foods.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-start gap-8 group"
              >
                <div className="flex-1 pr-4">
                  <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center rounded-sm mb-3">
                     <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">{item.name}</h3>
                  <div className="text-xl font-black text-gray-900 mb-4">₹{item.price}</div>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xl italic">
                    {item.description || "A masterfully crafted dish featuring fresh ingredients, signature spices, and the perfect balance of flavors to satisfy your ultimate cravings."}
                  </p>
                </div>
                
                <div className="relative w-40 h-40 shrink-0">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-full h-full rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </motion.div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] flex justify-center">
                    <motion.button 
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(item)}
                      className="w-full bg-white text-green-600 border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 shadow-xl py-3 rounded-2xl text-sm font-black uppercase transition-all"
                    >
                      ADD
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

