require('dotenv').config();
const { execSync } = require('child_process');

function runAutomatonCycle() {
  console.log('==============================================');
  console.log('  🍋 STARTING AUTOMATON ENGINE (MR. LEMON)  ');
  console.log('==============================================\n');

  try {
    console.log('[STEP 1] Auto-Discovering New Leads...');
    execSync('node src/skills/lead_prospector.js', { stdio: 'inherit' });

    console.log('[STEP 2] Running AI Outreach Pipeline...');
    execSync('node src/skills/auto_outreach.js', { stdio: 'inherit' });

    console.log('[STEP 3] Dispatching Client Emails...');
    execSync('node src/skills/email_sender.js', { stdio: 'inherit' });

    console.log('[STEP 4] Updating Analytics & SUMMARY.md...');
    execSync('node src/skills/summary_generator.js', { stdio: 'inherit' });

    console.log('[STEP 5] Sending Telegram Status Alert...');
    execSync('node src/skills/telegram_alert.js', { stdio: 'inherit' });

    console.log('==============================================');
    console.log('  ✅ AUTOMATON CYCLE COMPLETED SUCCESSFULLY!  ');
    console.log('==============================================\n');
  } catch (error) {
    console.error('[CRITICAL] Automaton Cycle Error:', error.message);
  }
}

runAutomatonCycle();
