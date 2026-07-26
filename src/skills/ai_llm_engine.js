require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runGemini() {
  console.log('[MR LEMON AI] Connecting to Gemini LLM Engine...');
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Generate a short 2-line client pitch for an automated lead generation SaaS tool.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log('\n--- [GEMINI AI PROPOSAL] ---');
    console.log(response.text());
    console.log('-----------------------------\n');
  } catch (err) {
    console.error('[GEMINI ERROR]', err.message);
  }
}

runGemini();
