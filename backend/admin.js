import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import Restaurant from './models/Restaurant.js';
import Food from './models/Food.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/FlavorSync');
    console.log('\n🌟 Welcome to the FlavorSync Admin Terminal 🌟');
    console.log('Use this script to easily add local restaurants (Dhabas, Cafes, etc.) to your app.\n');
    console.log('--- ADD A NEW LOCAL RESTAURANT ---\n');

    const name = await askQuestion('Restaurant Name (e.g. Pappu Dhaba): ');
    
    if (!name.trim()) {
       console.log('Name is required. Exiting.');
       process.exit(1);
    }

    const location = await askQuestion('Location (e.g. Main Market): ');
    const distance = await askQuestion('Distance (e.g. 1.5 km): ');
    const ratingInput = await askQuestion('Rating (e.g. 4.3): ');
    const rating = parseFloat(ratingInput) || 4.2;
    const cuisinesInput = await askQuestion('Cuisines (comma separated, e.g. North Indian, Snacks): ');
    const cuisines = cuisinesInput ? cuisinesInput.split(',').map(c => c.trim()) : ['Indian'];
    const discountToken = await askQuestion('Discount (e.g. Flat 10% OFF, or hit Enter to skip): ');
    let image = await askQuestion('Image URL (hit Enter for a default restaurant image): ');
    
    if (!image.trim()) {
      image = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'; // standard restaurant photo
    }

    const restaurant = new Restaurant({ 
        name, 
        location: location || 'Unknown Location', 
        distance: distance || '1.0 km', 
        rating, 
        cuisines, 
        discountToken, 
        image 
    });
    
    await restaurant.save();
    
    console.log(`\n✅ Successfully added "${name}" to the database!`);
    console.log(`Restaurant ID: ${restaurant._id}\n`);

    let addMoreFood = true;
    while (addMoreFood) {
      const addFood = await askQuestion(`>>> Do you want to add a menu item for ${name}? (y/n): `);
      if (addFood.toLowerCase() !== 'y') {
        addMoreFood = false;
        break;
      }

      console.log(`\n--- ADD FOOD ITEM TO ${name.toUpperCase()} ---`);
      const foodName = await askQuestion('Food Name (e.g. Paneer Butter Masala): ');
      const foodPriceInput = await askQuestion('Price in ₹ (e.g. 250): ');
      const price = parseFloat(foodPriceInput) || 99;
      const category = await askQuestion('Category (e.g. Indian, Pizza, Burger, Healthy, Mexican, Sushi): ');
      let foodImage = await askQuestion('Food Image URL (hit Enter for default image): ');
      
      if (!foodImage.trim()) {
        foodImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'; // standard food photo
      }

      const food = new Food({
        name: foodName || 'Special Item',
        restaurant: name,
        restaurantId: restaurant._id,
        price,
        rating: 4.5,
        image: foodImage,
        category: category || 'Indian',
        deliveryTime: '20-30 mins',
        discount: ''
      });

      await food.save();
      console.log(`✅ Added "${food.name}" for ₹${price}!\n`);
    }

    console.log('\n🎉 All done! Check your app to see the new restaurant. Exiting admin panel.');
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
