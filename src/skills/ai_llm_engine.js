require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runAI() {
  console.log('[MR LEMON AI] Connecting to Groq LLM Engine...');
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Generate a short 2-line client pitch for an automated lead generation SaaS tool.' }],
      model: 'llama-3.3-70b-versatile',
    });

    console.log('\n--- [AI PROPOSAL] ---');
    console.log(chatCompletion.choices[0]?.message?.content || '');
    console.log('---------------------\n');
  } catch (err) {
    console.error('[GROQ ERROR]', err.message);
  }
}

runAI();
