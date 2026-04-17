import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Minus, Plus, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { paymentAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const subtotal = useCartStore((state) => state.getSubtotal());
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();
  
  const deliveryFee = 40;
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      // 1. Create order on backend
      const { data: orderData } = await paymentAPI.createOrder({
        amount: total,
        items: cartItems.map(item => {
          const itemId = item.id || item._id || '';
          return {
            food: itemId.length > 20 ? itemId : undefined,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          };
        })
      });

      // 2. Open Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your-razorpay-key-id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Piggy',
        description: 'Food Order Payment',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment(response);
            clearCart();
            alert('Payment Successful! Your food is on the way.');
            navigate('/dashboard');
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#f97316',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to initiate payment';
      alert(`Checkout Error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 mt-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-10 rounded-3xl text-center shadow-sm border border-gray-100 flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-orange-500">
                    <ShoppingCart size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                  <Link to="/" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md">
                    Browse Restaurants
                  </Link>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white p-4 sm:p-5 rounded-3xl flex items-center gap-4 sm:gap-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl flex items-center justify-center text-5xl shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{item.name}</h3>
                      <p className="text-sm font-medium text-gray-500 mb-2 italic">from {item.restaurant}</p>
                      <span className="text-lg font-extrabold text-orange-500">₹{item.price}</span>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0 h-full justify-between">
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="flex items-center gap-3 bg-gray-50 px-2 py-1.5 rounded-xl border border-gray-200">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, -1)} 
                          className="text-gray-500 hover:text-black hover:bg-white w-6 h-6 flex items-center justify-center rounded shadow-sm transition-colors bg-gray-100"
                        >
                          <Minus size={14} />
                        </motion.button>
                        <span className="w-4 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, 1)} 
                          className="text-gray-500 hover:text-black hover:bg-white w-6 h-6 flex items-center justify-center rounded shadow-sm transition-colors bg-gray-100"
                        >
                          <Plus size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <motion.div 
              layout
              className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24"
            >
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-medium text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900">₹{deliveryFee.toFixed(0)}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-4 mt-2 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white font-bold py-4 px-4 rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
