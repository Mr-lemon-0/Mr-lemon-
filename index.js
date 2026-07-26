require('dotenv').config();
const { execSync } = require('child_process');

function runAutomatonCycle() {
  console.log('==============================================');
  console.log('  🍋 STARTING AUTOMATON ENGINE (MR. LEMON)  ');
  console.log('==============================================\n');

  try {
    console.log('[STEP 1] Running AI Outreach Pipeline...');
    execSync('node src/skills/auto_outreach.js', { stdio: 'inherit' });

    console.log('\n[STEP 2] Updating Analytics & SUMMARY.md...');
    execSync('node src/skills/summary_generator.js', { stdio: 'inherit' });

    console.log('\n==============================================');
    console.log('  ✅ AUTOMATON CYCLE COMPLETED SUCCESSFULLY!  ');
    console.log('==============================================\n');
  } catch (error) {
    console.error('[CRITICAL] Automaton Cycle Error:', error.message);
  }
}

runAutomatonCycle();
