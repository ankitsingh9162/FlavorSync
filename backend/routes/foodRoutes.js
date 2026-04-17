import express from 'express';
import Food from '../models/Food.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new food item
router.post('/', adminAuth, async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating food', error });
  }
});

export default router;
