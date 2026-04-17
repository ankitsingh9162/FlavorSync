import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from './models/Food.js';
import Restaurant from './models/Restaurant.js';

dotenv.config();

const RESTAURANTS = [
  { 
    name: 'Domino\'s Pizza', 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', 
    rating: 4.2, 
    cuisines: ['Pizzas', 'Italian', 'Fast Food'], 
    location: 'Shastri Nagar', 
    distance: '1.2 km', 
    discountToken: '₹150 OFF' 
  },
  { 
    name: 'Burger King', 
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', 
    rating: 4.1, 
    cuisines: ['Burgers', 'American'], 
    location: 'Model Town', 
    distance: '2.5 km', 
    discountToken: '60% OFF' 
  },
  { 
    name: 'Sharma Snacks', 
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80', 
    rating: 4.5, 
    cuisines: ['North Indian', 'Chinese', 'Snacks'], 
    location: 'Circular Road', 
    distance: '0.5 km', 
    discountToken: 'Up to 10% OFF' 
  },
  { 
    name: 'Sweet Tooth', 
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80', 
    rating: 4.8, 
    cuisines: ['Desserts', 'Cake', 'Bakery'], 
    location: 'City Center', 
    distance: '1.5 km', 
    discountToken: '20% OFF' 
  },
  { 
    name: 'Asian Delight', 
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', 
    rating: 4.6, 
    cuisines: ['Sushi', 'Chinese', 'Asian'], 
    location: 'Mall Road', 
    distance: '3.2 km', 
    discountToken: '₹200 OFF' 
  },
  { 
    name: 'South Express', 
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 
    rating: 4.3, 
    cuisines: ['South Indian', 'Biryani', 'Dosa'], 
    location: 'Tech Park', 
    distance: '4.0 km', 
    discountToken: 'Free Delivery' 
  },
  { 
    name: 'Taco Fiesta', 
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80', 
    rating: 4.4, 
    cuisines: ['Mexican', 'Fast Food'], 
    location: 'Downtown', 
    distance: '2.1 km', 
    discountToken: 'Buy 1 Get 1' 
  },
  { 
    name: 'Cafe Mocha', 
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80', 
    rating: 4.7, 
    cuisines: ['Coffee', 'Salad', 'Rolls'], 
    location: 'High Street', 
    distance: '0.8 km', 
    discountToken: '10% OFF' 
  }
];

const FOODS_TEMPLATE = [
  // Domino's
  { name: 'Margherita Pizza', restaurant: 'Domino\'s Pizza', price: 239, rating: 4.2, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80', category: 'Pizza', deliveryTime: '20-25 mins', discount: '30% OFF' },
  { name: 'Peppy Paneer', restaurant: 'Domino\'s Pizza', price: 459, rating: 4.6, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80', category: 'Pizza', deliveryTime: '30-35 mins', discount: '₹100 OFF' },
  // Burger King
  { name: 'Crispy Veg Burger', restaurant: 'Burger King', price: 79, rating: 4.1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', category: 'Burger', deliveryTime: '15-25 mins', discount: '40% OFF' },
  { name: 'Whopper', restaurant: 'Burger King', price: 179, rating: 4.5, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', category: 'Burger', deliveryTime: '20-30 mins', discount: 'Flat ₹50 OFF' },
  // Sharma Snacks
  { name: 'Aloo Samosa', restaurant: 'Sharma Snacks', price: 20, rating: 4.5, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', category: 'North Indian', deliveryTime: '10-15 mins', discount: '' },
  { name: 'Paneer Tikka', restaurant: 'Sharma Snacks', price: 180, rating: 4.6, image: 'https://images.unsplash.com/photo-1599487405270-817eb480f745?w=800&q=80', category: 'North Indian', deliveryTime: '20-30 mins', discount: 'Free Chutney' },
  // Sweet Tooth
  { name: 'Chocolate Truffle Cake', restaurant: 'Sweet Tooth', price: 450, rating: 4.9, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', category: 'Cake', deliveryTime: '30-40 mins', discount: '10% OFF' },
  { name: 'Blueberry Cheesecake', restaurant: 'Sweet Tooth', price: 250, rating: 4.8, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80', category: 'Desserts', deliveryTime: '20-30 mins', discount: '' },
  // Asian Delight
  { name: 'Spicy Tuna Roll', restaurant: 'Asian Delight', price: 350, rating: 4.7, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', category: 'Sushi', deliveryTime: '40-45 mins', discount: '15% OFF' },
  { name: 'Hakka Noodles', restaurant: 'Asian Delight', price: 190, rating: 4.5, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80', category: 'Chinese', deliveryTime: '25-35 mins', discount: '' },
  // South Express
  { name: 'Masala Dosa', restaurant: 'South Express', price: 120, rating: 4.6, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', category: 'Dosa', deliveryTime: '15-25 mins', discount: 'Free Sambhar' },
  { name: 'Hyderabadi Chicken Biryani', restaurant: 'South Express', price: 290, rating: 4.8, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', category: 'Biryani', deliveryTime: '30-45 mins', discount: '20% OFF' },
  { name: 'Idli Vada Combo', restaurant: 'South Express', price: 100, rating: 4.4, image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=800&q=80', category: 'South Indian', deliveryTime: '15-20 mins', discount: '' },
  // Taco Fiesta
  { name: 'Chicken Tacos', restaurant: 'Taco Fiesta', price: 210, rating: 4.4, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80', category: 'Mexican', deliveryTime: '20-30 mins', discount: 'Buy 1 Get 1' },
  // Cafe Mocha
  { name: 'Greek Salad', restaurant: 'Cafe Mocha', price: 150, rating: 4.5, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', category: 'Salad', deliveryTime: '15-20 mins', discount: '' },
  { name: 'Chicken Kathi Roll', restaurant: 'Cafe Mocha', price: 130, rating: 4.3, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80', category: 'Rolls', deliveryTime: '20-25 mins', discount: '' },
  { name: 'Cappuccino', restaurant: 'Cafe Mocha', price: 110, rating: 4.7, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80', category: 'Coffee', deliveryTime: '10-15 mins', discount: '' },
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/piggy')
  .then(async () => {
    console.log('MongoDB Connected correctly to server');
    
    await Restaurant.deleteMany({});
    await Food.deleteMany({});
    console.log('Old restaurants and foods removed');
    
    // Insert Restaurants
    const insertedRestaurants = await Restaurant.insertMany(RESTAURANTS);
    console.log('Restaurants seeded!');

    // Build Food mapping
    const foodsToInsert = FOODS_TEMPLATE.map(food => {
      // Find the ID of the restaurant that matches the string
      const matchedRestaurant = insertedRestaurants.find(r => r.name === food.restaurant);
      if (matchedRestaurant) {
        return { ...food, restaurantId: matchedRestaurant._id };
      }
      return food;
    });

    await Food.insertMany(foodsToInsert);
    console.log('Foods seeded with relationships!');

    console.log('Testing find in seed.js...');
    const testFind = await Restaurant.find({});
    console.log('Found:', testFind.length);

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
