import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function list() {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // We can't easily list models from the SDK without a special method
        // but we can try to get any model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('Model object created');
        const result = await model.generateContent("test");
        console.log('Success!');
    } catch (error) {
        console.log('ERR:', error.message);
    }
}
list();
