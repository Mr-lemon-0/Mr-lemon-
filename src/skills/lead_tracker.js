const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, '../../leads.json');

// Initialize local leads database if not exists
function initDatabase() {
  if (!fs.existsSync(LEADS_FILE)) {
    const initialData = [
      { id: 1, client: "TechCorp Solutions", email: "contact@techcorp.com", status: "New", value: "$500" },
      { id: 2, client: "GrowthX Agency", email: "sales@growthx.io", status: "Pitch Generated", value: "$1200" }
    ];
    fs.writeFileSync(LEADS_FILE, JSON.stringify(initialData, null, 2));
  }
}

function getLeads() {
  initDatabase();
  const data = fs.readFileSync(LEADS_FILE, 'utf8');
  return JSON.parse(data);
}

function addLead(client, email, value = "$0") {
  const leads = getLeads();
  const newLead = {
    id: leads.length + 1,
    client,
    email,
    status: "New",
    value,
    createdAt: new Date().toISOString()
  };
  leads.push(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  console.log(`[LEAD TRACKER] Added new lead: ${client}`);
  return newLead;
}

// Quick Test Run
initDatabase();
console.log('\n--- [CURRENT ACTIVE LEADS] ---');
console.table(getLeads());
console.log('------------------------------\n');

module.exports = { getLeads, addLead };
