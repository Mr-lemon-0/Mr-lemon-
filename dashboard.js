const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const LEADS_FILE = path.join(__dirname, 'leads.json');

app.get('/', (req, res) => {
  let leads = [];
  if (fs.existsSync(LEADS_FILE)) {
    leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  }

  const rows = leads.map(l => `
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">${l.client}</td>
      <td style="padding: 10px; border: 1px solid #333;">${l.email}</td>
      <td style="padding: 10px; border: 1px solid #333;">${l.value}</td>
      <td style="padding: 10px; border: 1px solid #333; color: ${l.status === 'Email Sent' ? '#4CAF50' : '#FF9800'}; font-weight: bold;">${l.status}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mr. Lemon Automaton Dashboard</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: sans-serif; background: #121212; color: #fff; padding: 20px; }
        h1 { color: #FFD700; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #1e1e1e; }
        th { background: #333; padding: 12px; border: 1px solid #444; text-align: left; }
      </style>
    </head>
    <body>
      <h1>🍋 Mr. Lemon Automaton Control Center</h1>
      <p>Live Lead Generation & AI Outreach Analytics</p>
      <table>
        <thead>
          <tr><th>Client</th><th>Email</th><th>Target Value</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${rows.length ? rows : '<tr><td colspan="4" style="padding: 15px;">No leads found.</td></tr>'}
        </tbody>
      </table>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`\n🍋 Dashboard running at: http://localhost:${PORT}\n`);
});
