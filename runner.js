const { execSync } = require('child_process');

// 1 Hour in milliseconds (3600000 ms)
const INTERVAL = 3600000; 

function executeLoop() {
  console.log(`\n[DAEMON] Triggering Automaton Cycle at ${new Date().toLocaleString()}...`);
  try {
    execSync('node index.js', { stdio: 'inherit' });
  } catch (e) {
    console.error('[DAEMON ERROR]', e.message);
  }
  console.log(`[DAEMON] Sleeping for 1 hour until next run...`);
}

// First run immediately
executeLoop();

// Repeat every hour
setInterval(executeLoop, INTERVAL);
