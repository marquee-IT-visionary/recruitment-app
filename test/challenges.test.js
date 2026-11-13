import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { runApiTests, schema, seed, starterApi } from '../src/challenges.js';

test('SQL challenge identifies the January 1992 Johnson with an MPS licence', async () => {
  const db = new PGlite();
  try {
    await db.exec(schema);
    await db.exec(seed);
    const result = await db.query(`SELECT c.customer_id, l.licence_number, cc.email
      FROM customers c
      JOIN customer_details cd ON cd.customer_id = c.customer_id
      JOIN customer_contacts cc ON cc.customer_id = c.customer_id
      JOIN licences l ON l.customer_id = c.customer_id
      JOIN licence_types lt ON lt.licence_type_id = l.licence_type_id
      WHERE c.last_name = 'Johnson' AND cd.date_of_birth >= DATE '1992-01-01'
        AND cd.date_of_birth < DATE '1992-02-01' AND lt.code = 'MPS'`);
    assert.deepEqual(result.rows, [{ customer_id: 102, licence_number: 'LIC-1002', email: 'morgan@example.test' }]);
    const count = await db.query('SELECT COUNT(*)::int AS count FROM customers');
    assert.equal(count.rows[0].count, 1005);
  } finally {
    await db.close();
  }
});

test('the starter API fails and a correct handler passes all cases', async () => {
  const broken = await runApiTests(starterApi);
  assert.ok(broken.results.some((result) => !result.passed));
  const fixed = await runApiTests(`
    async function getCustomer(request) {
      const id = request.params.id;
      if (!/^[0-9]+$/.test(id) || Number(id) <= 0) {
        return { status: 400, body: { error: 'Invalid customer ID' } };
      }
      const customer = await database.findCustomer(id);
      if (!customer) return { status: 404, body: { error: 'Customer not found' } };
      return { status: 200, body: customer };
    }
  `);
  assert.ok(fixed.results.every((result) => result.passed), JSON.stringify(fixed));
});

test('syntax errors are reported', async () => {
  const result = await runApiTests('function getCustomer( {');
  assert.match(result.error, /Could not load code/);
});
