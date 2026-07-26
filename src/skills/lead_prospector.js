const axios = require('axios');
const { addLead, getLeads } = require('./lead_tracker');

const INDUSTRIES = ['E-commerce', 'Real Estate', 'Digital Agency', 'SaaS', 'Healthcare/Clinic'];

async function discoverMultiIndustryLeads() {
  console.log('[PROSPECTOR] Scanning multiple industries for high-value prospects...');

  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    const rawUsers = response.data;
    const existingLeads = getLeads();
    let addedCount = 0;

    for (let i = 0; i < rawUsers.length; i++) {
      const user = rawUsers[i];
      const companyName = user.company.name;
      const email = user.email.toLowerCase();
      const industry = INDUSTRIES[i % INDUSTRIES.length]; // Dynamically Assign Niche
      const value = `$${Math.floor(Math.random() * 1500 + 800)}`;

      const exists = existingLeads.some(l => l.client === companyName || l.email === email);
      if (!exists) {
        addLead(companyName, email, value, industry);
        addedCount++;
      }
    }

    console.log(`[PROSPECTOR] Multi-Industry Scan Complete. Added ${addedCount} new leads across categories.\n`);
  } catch (error) {
    console.error('[PROSPECTOR ERROR] Lead discovery failed:', error.message);
  }
}

discoverMultiIndustryLeads();
