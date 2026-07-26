const { getLeads } = require('./lead_tracker');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const LEADS_FILE = path.join(__dirname, '../../leads.json');

async function processLeads() {
  console.log('[AUTOMATON] Scanning multi-industry leads pipeline...');
  const leads = getLeads();
  let updated = false;

  for (let lead of leads) {
    if (lead.status === 'New') {
      console.log(`[AI ENGINE] Crafting industry-specific pitch for ${lead.client} (${lead.industry || 'Business'})...`);
      
      try {
        const prompt = `You are Mr. Lemon, an elite AI Automation Consultant.
Write a punchy, high-converting 3-sentence cold outreach email to "${lead.client}" in the ${lead.industry || 'general business'} sector.
Highlight how our tailored AI automation solves their specific industry pain points, saves 15+ hours weekly, and scales revenue to ${lead.value}.
End with a clear, low-friction CTA for a quick 5-min call.`;

        const response = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.3-70b-versatile',
        });

        lead.pitch = response.choices[0]?.message?.content.trim();
        lead.status = 'Pitch Generated';
        lead.updatedAt = new Date().toISOString();
        updated = true;

        console.log(`\n--- [INDUSTRY PITCH: ${lead.industry || 'General'}] ---`);
        console.log(lead.pitch);
        console.log('-------------------------------------------\n');
      } catch (err) {
        console.error(`[ERROR] Failed to pitch ${lead.client}:`, err.message);
      }
    }
  }

  if (updated) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    console.log('[LEAD TRACKER] Multi-Industry Pitches Saved!');
  } else {
    console.log('[AUTOMATON] No new leads pending.');
  }
}

processLeads();
