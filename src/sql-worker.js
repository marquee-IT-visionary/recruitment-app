import { PGlite } from '@electric-sql/pglite';
import { schema, seed } from './challenges.js';

self.onmessage = async ({ data }) => {
  let db;
  try {
    db = new PGlite();
    await db.exec(schema);
    await db.exec(seed);
    const results = await db.exec(data, { rowMode: 'array', parsers: { 1082: (value) => value } });
    self.postMessage({ results: results.filter((result) => result.fields.length).map((result) => ({
      columns: result.fields.map((field) => field.name),
      values: result.rows
    })) });
  } catch (error) {
    self.postMessage({ error: error.message });
  } finally {
    await db?.close();
  }
};
