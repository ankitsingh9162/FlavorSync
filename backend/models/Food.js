import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  restaurant: { type: String, required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  deliveryTime: { type: String, default: '30-40 mins' },
  discount: { type: String, default: '' },
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);
export default Food;
