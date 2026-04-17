import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import RestaurantDetails from './pages/RestaurantDetails';
import Category from './pages/Category';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import AIChatBot from './components/AIChatBot';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 pb-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/category/:name" element={<Category />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
        <AIChatBot />
      </div>
    </BrowserRouter>
  );
}


export default App;

