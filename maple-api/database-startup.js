// Retry only initialization, never account creation or vote reward writes.
async function initializeDatabase(pool, migrations, {
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  log = console.error,
} = {}) {
  for (;;) {
    try {
      await pool.query("SELECT id FROM accounts LIMIT 0");
      await pool.query("SELECT id FROM characters LIMIT 0");
      for (const migrate of migrations) await migrate();
      return;
    } catch (error) {
      log(`[DB] Initialization failed (${error.code || "ERROR"}): ${error.message}. Retrying in 5s.`);
      await sleep(5000);
    }
  }
}

module.exports = { initializeDatabase };
