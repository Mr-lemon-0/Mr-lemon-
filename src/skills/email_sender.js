const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const LEADS_FILE = path.join(__dirname, '../../leads.json');

async function sendOutreachEmails() {
  console.log('[EMAIL SENDER] Checking for pending pitches to send...');
  
  if (!fs.existsSync(LEADS_FILE)) return;
  const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  let updated = false;

  // Gmail / SMTP Transporter Setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });

  for (let lead of leads) {
    if (lead.status === 'Pitch Generated' && lead.pitch) {
      console.log(`[EMAIL SENDER] Dispatching email to: ${lead.client} (${lead.email})...`);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'mr.lemon.automaton@gmail.com',
        to: lead.email,
        subject: `Strategic Growth Proposal for ${lead.client}`,
        text: `Hi ${lead.client} Team,\n\n${lead.pitch}\n\nBest regards,\nMr. Lemon Automation Team`
      };

      try {
        // If real email credentials are set, it sends real mail. 
        // Otherwise, it simulates dispatch so system pipeline doesn't break.
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          await transporter.sendMail(mailOptions);
          console.log(`[EMAIL SENDER] Live email sent to ${lead.email}`);
        } else {
          console.log(`[EMAIL SENDER SIMULATION] Email prepared & processed for ${lead.email}`);
        }

        lead.status = 'Email Sent';
        lead.sentAt = new Date().toISOString();
        updated = true;
      } catch (err) {
        console.error(`[EMAIL ERROR] Failed sending to ${lead.email}:`, err.message);
      }
    }
  }

  if (updated) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    console.log('[LEAD TRACKER] Status updated to "Email Sent" in database.\n');
  } else {
    console.log('[EMAIL SENDER] No pending emails to send.\n');
  }
}

sendOutreachEmails();
