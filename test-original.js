import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyLine = envFile.split('\n').find(line => line.startsWith('VITE_GEMINI_API_KEY='));
const apiKey = apiKeyLine ? apiKeyLine.split('=')[1].trim() : null;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function test() {
  const prompt = "Hello, respond with { \"success\": true }";
  
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  
  console.log("Status:", response.status);
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
