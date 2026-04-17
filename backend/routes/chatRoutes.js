import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const router = express.Router();

const categories = [
  'North Indian', 'Pizza', 'Burger', 'Sushi', 'Mexican', 
  'Desserts', 'Cake', 'Biryani', 'South Indian', 'Salad', 
  'Dosa', 'Rolls', 'Coffee', 'Chinese'
];

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are Piggy AI, a friendly and helpful food delivery assistant for the "Piggy" app. 
Your goal is to help users find delicious food and navigate the app.

Guidelines:
1. Always be polite, enthusiastic, and use emojis like 🐽, 🍕, 🍔, 🚀.
2. If the user is hungry or asking for food, suggest something from our categories: ${categories.join(', ')}.
3. CRITICAL: If you suggest a specific category or the user asks for one, you MUST include the keyword "NAVIGATE: [Category Name]" at the end of your message so the app can jump to that section. Replace [Category Name] with the exact name from the list above.
4. Keep your responses concise (under 3 sentences).
5. If you don't have an API key or can't connect, apologize and ask the user to check their settings.
`;

router.post('/', async (req, res) => {
  const { message, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'PASTE_YOUR_GEMINI_KEY_HERE') {
    return res.json({ 
      role: 'bot', 
      text: "I'm ready to be smart, but you haven't added my API key yet! 🐽 Please add the GEMINI_API_KEY in the backend .env file to unlock my full potential." 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-flash-latest for more stable availability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_PROMPT
    });
    
    // Format history for Gemini API
    let formattedHistory = history.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Gemini API requires the first message in history to strictly be from a 'user'
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    // Start a chat session with history
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Send the new message
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ role: 'bot', text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      role: 'bot', 
      text: `Oops! My brain hit a snag. 🐽 Error: ${error.message}` 
    });
  }
});

export default router;
