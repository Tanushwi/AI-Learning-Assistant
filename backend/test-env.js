import dotenv from 'dotenv';
dotenv.config();
console.log('API Key check:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
console.log('API Key value:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'NONE');
