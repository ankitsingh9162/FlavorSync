import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiPlusCircle, FiCheckCircle, FiLoader, FiLock } from 'react-icons/fi';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('restaurant'); // 'restaurant' or 'food'
  const [restForm, setRestForm] = useState({ name: '', location: '', distance: '', rating: '', cuisines: '', discountToken: '', image: '' });
  const [foodForm, setFoodForm] = useState({ name: '', restaurant: '', restaurantId: '', price: '', rating: '4.5', category: '', image: '', deliveryTime: '25-30 mins', discount: '' });
  const [restaurants, setRestaurants] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('piggy_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role === 'admin') {
            setIsAdmin(true);
            fetchRestaurants();
          }
        } catch (e) {
          console.error("Token parse error");
        }
      }
      setAuthChecking(false);
    };
    checkAdmin();
  }, []);

  const fetchRestaurants = () => {
    api.get('/restaurants')
      .then(res => setRestaurants(res.data))
      .catch(err => console.error('Error fetching restaurants', err));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.post('/auth/login', loginForm);
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.role === 'admin') {
        localStorage.setItem('piggy_token', token);
        setIsAdmin(true);
        fetchRestaurants();
      } else {
        setLoginError('Access Denied. You are not an admin.');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid admin credentials');
    }
  };

  const handleRestChange = (e) => setRestForm({ ...restForm, [e.target.name]: e.target.value });
  const handleFoodChange = (e) => setFoodForm({ ...foodForm, [e.target.name]: e.target.value });

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
  };

  const submitRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('piggy_token');
      const payload = {
        ...restForm,
        rating: parseFloat(restForm.rating) || 4.0,
        cuisines: restForm.cuisines.split(',').map(c => c.trim()),
        image: restForm.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'
      };
      
      const res = await api.post('/restaurants', payload);
      setRestaurants([...restaurants, res.data]);
      showStatus('success', `Restaurant "${payload.name}" added successfully!`);
      setRestForm({ name: '', location: '', distance: '', rating: '', cuisines: '', discountToken: '', image: '' });
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Failed to add restaurant. Check permissions.');
    } finally {
      setLoading(false);
    }
  };

  const submitFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('piggy_token');
      const selectedRest = restaurants.find(r => r._id === foodForm.restaurantId);
      if (!selectedRest) throw new Error("Select a restaurant first");

      const payload = {
        ...foodForm,
        restaurant: selectedRest.name,
        price: parseFloat(foodForm.price) || 99,
        rating: parseFloat(foodForm.rating) || 4.5,
        image: foodForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'
      };

      await api.post('/foods', payload);
      showStatus('success', `Food item "${payload.name}" added successfully!`);
      setFoodForm({ name: '', restaurant: '', restaurantId: '', price: '', rating: '4.5', category: '', image: '', deliveryTime: '25-30 mins', discount: '' });
    } catch (err) {
      showStatus('error', err.response?.data?.message || err.message || 'Failed to add food. Check permissions.');
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-medium">Checking authenticaton...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans py-20 px-4">
        <div className="max-w-md mx-auto w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gray-900 p-8 text-center">
            <FiLock className="text-4xl text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-extrabold text-white">Admin Access Only</h1>
            <p className="text-gray-400 text-sm mt-2">Please log in to the secure dashboard</p>
          </div>
          <form className="p-8 space-y-5" onSubmit={handleAdminLogin}>
            {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-semibold">{loginError}</div>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Email</label>
              <input type="email" required value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium text-gray-900" placeholder="admin@piggy.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" required value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium text-gray-900" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl shadow-lg mt-2 transition-all">Secure Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-20">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your platform data visually</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('piggy_token'); setIsAdmin(false); }}
            className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
          >
            Logout Admin
          </button>
        </div>

        {statusMsg.text && (
          <div className={`p-4 mb-6 rounded-xl font-medium border flex items-center gap-3 transition-all ${statusMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            <FiCheckCircle className="text-xl" />
            {statusMsg.text}
          </div>
        )}

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button 
              className={`flex-1 py-5 text-center font-bold text-sm uppercase tracking-widest transition-colors ${activeTab === 'restaurant' ? 'bg-white text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('restaurant')}
            >
              Add Restaurant
            </button>
            <button 
              className={`flex-1 py-5 text-center font-bold text-sm uppercase tracking-widest transition-colors ${activeTab === 'food' ? 'bg-white text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('food')}
            >
              Add Food / Variety
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'restaurant' && (
              <form onSubmit={submitRestaurant} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">New Restaurant Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant Name *</label>
                    <input required name="name" value={restForm.name} onChange={handleRestChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. Pappu Dhaba" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                    <input required name="location" value={restForm.location} onChange={handleRestChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. Model Town" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisines *</label>
                    <input required name="cuisines" value={restForm.cuisines} onChange={handleRestChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. Pizza, Fast Food" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Distance</label>
                    <input name="distance" value={restForm.distance} onChange={handleRestChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. 2.5 km" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <input type="number" step="0.1" name="rating" value={restForm.rating} onChange={handleRestChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. 4.3" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Token</label>
                    <input name="discountToken" value={restForm.discountToken} onChange={handleRestChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. Flat 10% OFF" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                    <input name="image" value={restForm.image} onChange={handleRestChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="Leave empty for a default image" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={loading} className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
                    {loading ? <FiLoader className="animate-spin" /> : <FiPlusCircle />}
                    Add Restaurant
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'food' && (
              <form onSubmit={submitFood} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">New Food Variety Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Restaurant *</label>
                    <select required name="restaurantId" value={foodForm.restaurantId} onChange={handleFoodChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                      <option value="">-- Select a Restaurant --</option>
                      {restaurants.map(r => (
                        <option key={r._id} value={r._id}>{r.name} - {r.location}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Food Name *</label>
                    <input required name="name" value={foodForm.name} onChange={handleFoodChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. Cold Coffee" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select required name="category" value={foodForm.category} onChange={handleFoodChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                      <option value="">-- Select a Category --</option>
                      <option value="North Indian">North Indian</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Burger">Burger</option>
                      <option value="Sushi">Sushi</option>
                      <option value="Mexican">Mexican</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Cake">Cake</option>
                      <option value="Biryani">Biryani</option>
                      <option value="South Indian">South Indian</option>
                      <option value="Salad">Salad</option>
                      <option value="Dosa">Dosa</option>
                      <option value="Rolls">Rolls</option>
                      <option value="Coffee">Coffee</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                    <input required type="number" name="price" value={foodForm.price} onChange={handleFoodChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. 150" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <input type="number" step="0.1" name="rating" value={foodForm.rating} onChange={handleFoodChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="e.g. 4.5" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                    <input name="image" value={foodForm.image} onChange={handleFoodChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="Leave empty for a default image" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={loading} className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
                    {loading ? <FiLoader className="animate-spin" /> : <FiPlusCircle />}
                    Add Food Item
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
