const { execSync } = require('child_process');

console.log('--- [MR LEMON SYSTEM AUTOMATION] ---');
try {
  console.log('\n1. Running Lead Tracker Engine...');
  execSync('node src/skills/lead_tracker.js', { stdio: 'inherit' });

  console.log('\n2. Running Income Engine...');
  execSync('node src/skills/ultra_income_engine.js', { stdio: 'inherit' });

  console.log('\n[ALL MODULES EXECUTED SUCCESSFULLY]');
} catch (err) {
  console.error('[ERROR]', err.message);
}
