const { getLeads } = require('./lead_tracker');
const { buildAndValidateWebsite } = require('./site_builder');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const LEADS_FILE = path.join(__dirname, '../../leads.json');
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || "0x753a8...72F0C";

async function processLeads() {
  console.log('[AUTOMATON] Scanning leads for zero-human-intervention pipeline...');
  const leads = getLeads();
  let updated = false;

  for (let lead of leads) {
    if (lead.status === 'New') {
      console.log(`\n[AUTONOMOUS ENGINE] Processing client: ${lead.client} (${lead.industry})...`);
      
      // Step A: Pre-generate & Validate Website Code
      await buildAndValidateWebsite(lead.client, lead.industry || 'Business');

      // Step B: Craft Dynamic Pitch with Crypto Payment Instructions
      try {
        const prompt = `You are Mr. Lemon, an autonomous AI Agency Agent.
Write a concise 3-sentence high-converting cold email pitch to "${lead.client}" in the ${lead.industry} industry.
Offer a complete AI-driven website and revenue automation system built specifically for them.
State that a preview is already pre-built for them.
Mention payment can be processed seamlessly via USDT/Crypto directly to our Web3 Smart Wallet: ${WALLET_ADDRESS}.
End with a call to action to review the proposal.`;

        const response = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.3-70b-versatile',
        });

        lead.pitch = response.choices[0]?.message?.content.trim();
        lead.status = 'Pitch Generated';
        lead.updatedAt = new Date().toISOString();
        updated = true;

        console.log(`\n--- [AUTONOMOUS PITCH GENERATED] ---`);
        console.log(lead.pitch);
        console.log('------------------------------------\n');
      } catch (err) {
        console.error(`[ERROR] Failed to process ${lead.client}:`, err.message);
      }
    }
  }

  if (updated) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    console.log('[LEAD TRACKER] Autonomous pipeline updated successfully!');
  }
}

processLeads();
