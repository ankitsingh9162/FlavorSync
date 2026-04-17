import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey || apiKey === 'PASTE_YOUR_GEMINI_KEY_HERE') {
        console.log('API Key not found or placeholder');
        return;
    }

    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        console.log('Available Models:', response.data.models.map(m => m.name));
    } catch (error) {
        console.error('ERROR during list:', error.response ? error.response.data : error.message);
    }
}

run();
