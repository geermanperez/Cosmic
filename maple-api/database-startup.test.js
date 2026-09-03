const { test } = require('node:test');
const assert = require('node:assert/strict');
const { initializeDatabase } = require('./database-startup');

test('waits for MySQL and the game schema before running migrations', async () => {
  let queries = 0;
  let waits = 0;
  let migrations = 0;
  await initializeDatabase({ query: async () => {
    queries++;
    if (queries <= 2) throw Object.assign(new Error('Database unavailable'), {
      code: queries === 1 ? 'ECONNREFUSED' : 'ER_NO_SUCH_TABLE',
    });
  } }, [async () => { migrations++; }], {
    sleep: async (ms) => { assert.equal(ms, 5000); waits++; }, log: () => {},
  });
  assert.equal(waits, 2);
  assert.equal(queries, 4);
  assert.equal(migrations, 1);
});

test('retries failed migrations and completes all migrations before returning', async () => {
  const calls = [];
  let attempts = 0;
  await initializeDatabase({ query: async () => {} }, [
    async () => { calls.push('first'); },
    async () => {
      calls.push('second');
      if (++attempts === 1) throw new Error('Connection lost during initialization');
    },
    async () => { calls.push('last'); },
  ], { sleep: async () => { calls.push('wait'); }, log: () => {} });
  assert.deepEqual(calls, ['first', 'second', 'wait', 'first', 'second', 'last']);
});
