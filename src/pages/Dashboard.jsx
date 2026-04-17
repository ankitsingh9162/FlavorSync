import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Package, MapPin, CreditCard, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'favourites', label: 'Favourites', icon: Heart },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile', label: 'Edit Profile', icon: User },
    // { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Past Orders</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center">
              <div className="bg-orange-50 p-4 rounded-full mb-4">
                <Package className="text-orange-500" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Orders Yet</h3>
              <p className="text-gray-500 text-sm mb-6">You haven't placed any orders yet. Explore top restaurants near you!</p>
              <button 
                onClick={() => navigate('/menu')}
                className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-100"
              >
                Browse Restaurants
              </button>
            </div>
          </div>
        );
      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Addresses</h2>
              <button className="text-orange-600 font-bold text-sm hover:text-orange-700">+ ADD NEW ADDRESS</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-1">Home</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">India, Local Address Placeholder</p>
                    <div className="mt-4 flex gap-4 text-xs font-bold text-orange-600">
                      <button>EDIT</button>
                      <button>DELETE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                <div className="h-20 w-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">
                  {user?.name?.[0]}
                </div>
                <div>
                  <button className="text-orange-600 font-bold text-sm hover:text-orange-700">Change Photo</button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all font-medium text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" defaultValue={user?.email} readOnly className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-transparent outline-none font-medium text-gray-500 cursor-not-allowed" />
                </div>
                <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all mt-4 transform active:scale-95">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">Coming soon: {activeTab}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dashboard Header - Mobile Only */}
      <div className="md:hidden bg-gray-900 text-white px-6 py-10">
        <h1 className="text-3xl font-black">{user?.name}</h1>
        <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full md:w-80">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden sticky top-28">
              <div className="hidden md:block bg-gray-900 text-white p-8">
                <h1 className="text-2xl font-black">{user?.name?.split(' ')[0]}'s Account</h1>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="py-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-8 py-5 transition-all outline-none ${
                      activeTab === tab.id 
                        ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <tab.icon size={20} className={activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'} />
                      <span className="font-bold text-sm tracking-wide">{tab.label}</span>
                    </div>
                    <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
                  </button>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-50 px-8">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 text-red-500 hover:text-red-600 font-bold text-sm py-4 w-full"
                  >
                    <LogOut size={20} />
                    <span>LOGOUT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow min-h-[600px]">
            {renderContent()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
