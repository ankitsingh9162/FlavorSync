import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-black bg-clip-text text-transparent text-white">
              FlavorSync
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Delivering happiness to your doorstep. Experience the fastest and most reliable food delivery service in town.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300">
              <FiFacebook />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300">
              <FiTwitter />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300">
              <FiInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-orange-500 transition-colors">Explore</Link></li>
            <li><Link to="/cart" className="hover:text-orange-500 transition-colors">Your Cart</Link></li>
            <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FiMapPin className="text-orange-500 mt-1 flex-shrink-0" />
              <span>123 Food Street, Culinary District, FK 45678</span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="text-orange-500 flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="text-orange-500 flex-shrink-0" />
              <span>support@flavorsync.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">Subscribe to get special offers, free giveaways, and updates.</p>
          <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent transition-all"
            />
            <button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} FlavorSync Food Delivery. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
