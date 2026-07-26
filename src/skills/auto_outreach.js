const { getLeads } = require('./lead_tracker');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const LEADS_FILE = path.join(__dirname, '../../leads.json');

async function processLeads() {
  console.log('[AUTOMATON] Scanning leads pipeline...');
  const leads = getLeads();
  let updated = false;

  for (let lead of leads) {
    if (lead.status === 'New') {
      console.log(`[AI ENGINE] Crafting hyper-personalized pitch for: ${lead.client}...`);
      
      try {
        const prompt = `You are Mr. Lemon, an elite AI Automation & Growth Consultant. 
Write a short, highly persuasive email pitch to "${lead.client}" (${lead.email}).
Focus: Show how our AI workflow can automate their client acquisition, cut manual labor by 80%, and scale revenue to ${lead.value}.
Keep it under 3 punchy sentences with a clear call-to-action asking for a quick 5-min chat. No fluff.`;

        const response = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.3-70b-versatile',
        });

        lead.pitch = response.choices[0]?.message?.content.trim();
        lead.status = 'Pitch Generated';
        lead.updatedAt = new Date().toISOString();
        updated = true;

        console.log(`\n--- [SMART PITCH FOR ${lead.client}] ---`);
        console.log(lead.pitch);
        console.log('-------------------------------------------\n');
      } catch (err) {
        console.error(`[ERROR] Failed to pitch ${lead.client}:`, err.message);
      }
    }
  }

  if (updated) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    console.log('[LEAD TRACKER] Leads database updated with Smart Pitches!');
  } else {
    console.log('[AUTOMATON] No new leads pending for pitch.');
  }
}

processLeads();
