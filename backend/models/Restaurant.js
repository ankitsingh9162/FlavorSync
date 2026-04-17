import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  cuisines: [{ type: String }],
  location: { type: String, required: true },
  distance: { type: String, required: true },
  discountToken: { type: String, default: '' },
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
