import express from 'express';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Server error fetching restaurants', error: error.message });
  }
});

// Get a single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching restaurant' });
  }
});

// Get foods for a specific restaurant
router.get('/:id/foods', async (req, res) => {
  try {
    const foods = await Food.find({ restaurantId: req.params.id });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching foods for restaurant' });
  }
});

// API to create a new restaurant manually if needed
router.post('/', adminAuth, async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating restaurant', error });
  }
});

export default router;
