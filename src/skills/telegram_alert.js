const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramAlert(message) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log('[TELEGRAM] Token/ChatID missing in .env. Skipping Telegram alert.');
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('[TELEGRAM] Alert sent successfully to Telegram!');
  } catch (err) {
    console.error('[TELEGRAM ERROR] Could not send alert:', err.message);
  }
}

// Function to send quick pipeline update
async function notifyPipelineStatus() {
  const LEADS_FILE = path.join(__dirname, '../../leads.json');
  if (!fs.existsSync(LEADS_FILE)) return;

  const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  const total = leads.length;
  const sent = leads.filter(l => l.status === 'Email Sent').length;

  const text = `🍋 *Mr. Lemon Automaton Alert*\n\n` +
               `📊 *Total Leads:* ${total}\n` +
               `✉️ *Emails Dispatched:* ${sent}\n` +
               `🚀 *Status:* Active & Running 24/7`;

  await sendTelegramAlert(text);
}

notifyPipelineStatus();
module.exports = { sendTelegramAlert };
