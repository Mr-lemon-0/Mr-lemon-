require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
});

async function runLLM() {
  console.log('[MR LEMON AI] Connecting to OpenAI LLM Engine...');
  
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    console.log('[WARNING] OpenAI API Key missing in .env file!');
    console.log('[INFO] Please add your key in .env file using: nano .env');
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Generate 1 high-ticket client proposal summary for Automaton." }],
    });

    console.log('[AI LLM RESPONSE]:');
    console.log(response.choices[0].message.content);
  } catch (err) {
    console.error('[OPENAI ERROR]', err.message);
  }
}

runLLM();
