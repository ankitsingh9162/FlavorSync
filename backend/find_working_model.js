import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('No API key found in .env');
    process.exit(1);
}

const models = [
    'gemini-flash-latest',
    'gemini-pro-latest',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash-latest', // Guessing this one
    'gemini-1.5-flash'
];

async function test() {
    console.log('Testing with API Key:', apiKey.substring(0, 5) + '...');
    for (const m of models) {
        console.log(`\nTesting model: ${m}`);
        try {
            const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
                contents: [{ parts: [{ text: 'Hi' }] }]
            });
            console.log(`✅ SUCCESS: ${m}`);
            console.log('Response:', res.data.candidates[0].content.parts[0].text.substring(0, 50));
            return m;
        } catch (e) {
            console.log(`❌ FAIL: ${m}`);
            if (e.response) {
                console.log(`   Status: ${e.response.status}`);
                console.log(`   Message: ${e.response.data?.error?.message}`);
            } else {
                console.log(`   Error: ${e.message}`);
            }
        }
    }
}

test();
