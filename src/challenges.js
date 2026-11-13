export const schema = `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);
CREATE TABLE customer_details (
  customer_id INTEGER PRIMARY KEY REFERENCES customers(customer_id),
  date_of_birth DATE NOT NULL
);
CREATE TABLE customer_contacts (
  contact_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
  email TEXT NOT NULL,
  phone TEXT NOT NULL
);
CREATE TABLE licence_types (
  licence_type_id INTEGER PRIMARY KEY,
  code TEXT NOT NULL,
  description TEXT NOT NULL
);
CREATE TABLE licences (
  licence_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
  licence_number TEXT NOT NULL,
  licence_type_id INTEGER NOT NULL REFERENCES licence_types(licence_type_id)
);
`;

export const seed = `
INSERT INTO customers VALUES
  (101, 'Avery', 'Johnson'),
  (102, 'Morgan', 'Johnson'),
  (103, 'Sam', 'Johnson'),
  (104, 'Taylor', 'Jones'),
  (105, 'Jordan', 'Johnson');
INSERT INTO customer_details VALUES
  (101, '1992-01-12'), (102, '1992-01-29'), (103, '1992-02-01'),
  (104, '1992-01-09'), (105, '1991-01-15');
INSERT INTO customer_contacts VALUES
  (101, 101, 'avery@example.test', '555-0101'),
  (102, 102, 'morgan@example.test', '555-0102'),
  (103, 103, 'sam@example.test', '555-0103'),
  (104, 104, 'taylor@example.test', '555-0104'),
  (105, 105, 'jordan@example.test', '555-0105');
INSERT INTO licence_types VALUES (1, 'Standard', 'Standard licence'), (2, 'MPS', 'MPS licence');
INSERT INTO licences VALUES
  (1, 101, 'LIC-1001', 1), (2, 102, 'LIC-1002', 2),
  (3, 103, 'LIC-1003', 2), (4, 104, 'LIC-1004', 2),
  (5, 105, 'LIC-1005', 2);
INSERT INTO customers
SELECT i, 'Customer' || i, (ARRAY['Smith', 'Lee', 'Johnson', 'Brown'])[1 + i % 4]
FROM generate_series(1000, 1999) AS i;
INSERT INTO customer_details
SELECT i, DATE '1980-01-01' + i FROM generate_series(1000, 1999) AS i;
INSERT INTO customer_contacts
SELECT i, i, 'customer' || i || '@example.test', '555-' || i
FROM generate_series(1000, 1999) AS i;
INSERT INTO licences
SELECT i, i, 'LIC-' || i, 1 + i % 2 FROM generate_series(1000, 1999) AS i;
`;

export const starterSql = `SELECT *
FROM customers;`;

export const starterApi = `async function getCustomer(request) {
  const customer = database.findCustomer(request.params.id);

  return {
    status: 200,
    body: customer
  };
}`;

// Keep this function self-contained: it also runs inside the isolated worker.
export async function runApiTests(source) {
  const customers = [
    { id: 101, firstName: 'Avery', lastName: 'Johnson' },
    { id: 102, firstName: 'Morgan', lastName: 'Johnson' }
  ];
  const cases = [
    { name: 'Returns customer 101', id: '101', status: 200, body: customers[0] },
    { name: 'Returns customer 102', id: '102', status: 200, body: customers[1] },
    { name: 'Returns 404 for an unknown customer', id: '999', status: 404, body: { error: 'Customer not found' } },
    { name: 'Returns 400 for a non-numeric ID', id: 'abc', status: 400, body: { error: 'Invalid customer ID' } },
    { name: 'Returns 400 for a zero ID', id: '0', status: 400, body: { error: 'Invalid customer ID' } },
    { name: 'Returns 400 for a negative ID', id: '-1', status: 400, body: { error: 'Invalid customer ID' } },
    { name: 'Returns 400 for a fractional ID', id: '1.5', status: 400, body: { error: 'Invalid customer ID' } }
  ];
  const database = {
    async findCustomer(id) {
      return customers.find((customer) => customer.id === Number(id)) ?? null;
    }
  };
  let handler;
  try {
    handler = new Function('database', `"use strict";\n${source}\n; return typeof getCustomer === "function" ? getCustomer : null;`)(database);
    if (!handler) throw new Error('Define a function named getCustomer.');
  } catch (error) {
    return { error: `Could not load code: ${error.message}` };
  }

  const results = [];
  for (const test of cases) {
    try {
      const response = await handler({ params: { id: test.id } });
      const body = response?.body;
      const keys = Object.keys(test.body);
      const bodyMatches = body !== null && typeof body === 'object' &&
        keys.every((key) => body[key] === test.body[key]);
      const passed = response?.status === test.status && bodyMatches;
      results.push({
        name: test.name,
        passed,
        detail: passed ? `HTTP ${test.status}` : `Expected HTTP ${test.status} and ${JSON.stringify(test.body)}; received ${JSON.stringify(response) ?? 'undefined'}.`
      });
    } catch (error) {
      results.push({ name: test.name, passed: false, detail: `Error: ${error.message}` });
    }
  }
  return { results };
}
