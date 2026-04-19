import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-orange-600 font-bold' : 'text-gray-800 hover:text-orange-500 font-medium transition-colors duration-200';
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-white py-5 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
                FlavorSync
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 text-sm max-w-xs cursor-pointer group">
              <span className="font-bold border-b-2 border-gray-800 group-hover:text-orange-500 group-hover:border-orange-500 transition-colors">Other</span>
              <span className="text-gray-500 truncate group-hover:text-gray-600">India</span>
              <MapPin size={18} className="text-orange-500" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-800 hover:text-orange-500 font-medium transition-colors flex items-center gap-2">
              <Search size={18} /> Search
            </Link>
            <Link to="/menu" className="text-gray-800 hover:text-orange-500 font-medium transition-colors">
              Offers
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-800 hover:text-orange-500 font-medium transition-colors flex items-center gap-2 outline-none"
                >
                  <User size={18} /> {user?.name?.split(' ')[0]}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium border-t border-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-800 hover:text-orange-500 font-medium transition-colors flex items-center gap-2">
                <User size={18} /> Sign In
              </Link>
            )}

            <Link to="/cart" className="relative text-gray-800 hover:text-orange-500 font-medium transition-colors flex items-center gap-2 group">
              <ShoppingBag size={18} /> Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -left-2 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white group-hover:scale-110 transition-transform">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};


export default Navbar;
