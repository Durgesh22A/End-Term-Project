import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyLine = envFile.split('\n').find(line => line.startsWith('VITE_GEMINI_API_KEY='));
const apiKey = apiKeyLine ? apiKeyLine.split('=')[1].trim() : null;

if (!apiKey) {
  console.error("No API key found");
  process.exit(1);
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function test() {
  console.log("Testing Gemini API with key:", apiKey.substring(0, 5) + "...");
  const prompt = "Hello, respond with a valid JSON containing { \"success\": true }";
  
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        responseMimeType: 'application/json',
      },
    }),
  });
  
  console.log("Status:", response.status, response.statusText);
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
