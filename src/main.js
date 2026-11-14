import './style.css';
import './login-styles.css';
import { schema, starterApi, starterSql } from './challenges.js';
import { runApi } from './api-runner.js';
import { PAGES, CREDENTIALS, showLoginPage, showSelectionPage } from './pages.js';

const app = document.querySelector('#app');
let currentPage = PAGES.LOGIN;
let currentUser = null;

function renderLoginPage() {
  app.innerHTML = showLoginPage();
  const form = document.querySelector('#login-form');
  const cancelBtn = document.querySelector('#cancel-btn');
  const errorDiv = document.querySelector('#login-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      currentUser = username;
      currentPage = PAGES.SELECTION;
      renderSelectionPage();
    } else {
      errorDiv.textContent = 'Invalid username or password';
    }
  });

  cancelBtn.addEventListener('click', () => {
    document.querySelector('#username').value = '';
    document.querySelector('#password').value = '';
    errorDiv.textContent = '';
  });
}

function renderSelectionPage() {
  app.innerHTML = showSelectionPage();
  const developerTile = document.querySelector('#developer-tile');
  const testerTile = document.querySelector('#tester-tile');
  const logoutBtn = document.querySelector('#logout-btn');

  developerTile.addEventListener('click', () => {
    currentPage = PAGES.DEVELOPER;
    renderDeveloperAssessment();
  });

  testerTile.addEventListener('click', () => {
    currentPage = PAGES.TESTER;
    renderTesterAssessment();
  });

  logoutBtn.addEventListener('click', () => {
    currentUser = null;
    currentPage = PAGES.LOGIN;
    renderLoginPage();
  });
}

function renderDeveloperAssessment() {
  app.innerHTML = `
    <header class="topbar"><div class="brand"><span class="brand-icon">R</span><span>RECRUITMENT <strong>LAB</strong></span></div><span class="top-tag">DEVELOPER ASSESSMENT</span></header>
    <main>
      <div class="intro"><div><div class="eyebrow"><span class="dot"></span> PRACTICE ENVIRONMENT</div><h1>Developer assessment</h1><p>Two practical challenges. One workspace. Show us how you solve real-world problems.</p></div><div class="intro-badge"><span>✦</span><div><strong>Your workspace</strong><small>Work at your own pace</small></div></div></div>
      <div class="overview"><span><strong>02</strong> challenges</span><span class="divider"></span><span>SQL + JavaScript</span><span class="divider"></span><span>No time limit</span></div>
      <section class="challenge">
        <div class="section-heading"><span class="number">01</span><div><div class="section-kicker">DATABASE CHALLENGE</div><h2>Find the right licence</h2></div><span class="pill">SQL <span>·</span> PostgreSQL</span></div>
        <p class="brief">Find the licence for a customer whose last name is <strong>Johnson</strong> and who was born in <strong>January 1992</strong>. If there are multiple matching customers, find the record with an <strong>MPS</strong> licence.</p>
        <p class="hint">Return the customer, date of birth, contact and licence details. Dates use the <code>DATE</code> type.</p>
        <div class="diagram-block">
          <div class="block-heading"><span>ENTITY RELATIONSHIP DIAGRAM</span><span>PK = PRIMARY KEY · FK = FOREIGN KEY</span></div>
          <div class="diagram-scroll">
            <svg class="diagram" viewBox="0 0 920 320" role="img" aria-labelledby="er-title er-description">
              <title id="er-title">Customer licence database relationships</title>
              <desc id="er-description">A customer may have one details record and may have many contacts and licences. Each licence belongs to one licence type; a licence type may have many licences. Foreign keys join the tables.</desc>
              <g class="er-lines">
                <path d="M 220 92 H 275"/><path d="M 220 112 H 248 V 250 H 275"/>
                <path d="M 115 35 V 20 H 680 V 35"/><path d="M 500 250 H 555"/>
              </g>
              <g class="er-labels">
                <text x="220" y="84">1 : 0..1</text><text x="210" y="204">1 : 0..N</text>
                <text x="380" y="15">1 : 0..N</text><text x="505" y="242">N : 1</text>
              </g>
              <g class="er-box" transform="translate(15 35)"><rect width="205" height="105" rx="8"/><text class="er-title" x="14" y="24">customers</text><text x="14" y="48">PK  customer_id</text><text x="14" y="67">first_name</text><text x="14" y="86">last_name</text></g>
              <g class="er-box" transform="translate(275 35)"><rect width="225" height="105" rx="8"/><text class="er-title" x="14" y="24">customer_details</text><text x="14" y="48">PK, FK  customer_id</text><text x="14" y="67">date_of_birth</text></g>
              <g class="er-box" transform="translate(275 185)"><rect width="225" height="120" rx="8"/><text class="er-title" x="14" y="24">licences</text><text x="14" y="48">PK  licence_id</text><text x="14" y="67">FK  customer_id</text><text x="14" y="86">licence_number</text><text x="14" y="105">FK  licence_type_id</text></g>
              <g class="er-box" transform="translate(555 35)"><rect width="250" height="120" rx="8"/><text class="er-title" x="14" y="24">customer_contacts</text><text x="14" y="48">PK  contact_id</text><text x="14" y="67">FK  customer_id</text><text x="14" y="86">email</text><text x="14" y="105">phone</text></g>
              <g class="er-box" transform="translate(555 185)"><rect width="250" height="105" rx="8"/><text class="er-title" x="14" y="24">licence_types</text><text x="14" y="48">PK  licence_type_id</text><text x="14" y="67">code</text><text x="14" y="86">description</text></g>
            </svg>
          </div>
        </div>
        <div class="sql-layout">
          <div class="editor-block"><div class="block-heading"><span>SQL EDITOR</span><span>PostgreSQL</span></div><label class="sr-only" for="sql-editor">SQL query</label><textarea id="sql-editor" spellcheck="false"></textarea><div class="editor-footer"><span>Run your query against the sample database</span><button id="run-sql">▶ &nbsp; Run query</button></div></div>
          <div class="schema-block"><div class="block-heading"><span>DATABASE SCHEMA</span><span>5 TABLES</span></div><pre id="schema"></pre><p>1,005 fictional customers. Each query runs on a fresh copy of the sample data.</p></div>
        </div>
        <div class="results-block"><div class="results-heading"><div><span class="result-icon">▤</span><strong>Query results</strong></div><span id="sql-status" class="muted">Ready to run</span></div><div id="sql-results" class="empty">Run your query to see the results here.</div></div>
      </section>
      <section class="challenge">
        <div class="section-heading"><span class="number purple">02</span><div><div class="section-kicker">API CHALLENGE</div><h2>Fix the customer API</h2></div><span class="pill purple-pill">JavaScript</span></div>
        <p class="brief">The customer endpoint isn't behaving as expected. Review the code, make the necessary changes, and run the tests to check your fix.</p>
        <div class="api-spec"><div><span class="method">GET</span> <code>/api/customers/:id</code></div><p>For a valid ID, return <code>{ status: 200, body: customer }</code>. For an unknown ID, return <code>{ status: 404, body: { error: 'Customer not found' } }</code>. For a non-numeric or non-positive integer ID, return <code>{ status: 400, body: { error: 'Invalid customer ID' } }</code>.</p><p><code>database.findCustomer(id)</code> returns a promise resolving to a customer or <code>null</code>. IDs arrive as strings. Sample customer IDs: <code>101</code>, <code>102</code>.</p></div>
        <div class="api-editor editor-block"><div class="block-heading"><span>CODE EDITOR</span><span>customer-api.js</span></div><label class="sr-only" for="api-editor">API handler code</label><textarea id="api-editor" spellcheck="false"></textarea><div class="editor-footer"><span>Simulated requests · no external API or Postman needed</span><button id="run-api">▶ &nbsp; Run API tests</button></div></div>
        <div class="results-block"><div class="results-heading"><div><span class="result-icon">✓</span><strong>Test results</strong></div><span id="api-status" class="muted">Ready to run</span></div><div id="api-results" class="empty">Run the API tests to check your solution.</div></div>
      </section>
      <div style="text-align: center; margin-top: 30px;">
        <button id="back-btn" class="btn-back">← Back to Selection</button>
      </div>
      <footer>RECRUITMENT LAB <span>·</span> Developer assessment prototype <span>·</span> Refreshing the page clears your work</footer>
    </main>
  `;

  const $ = (selector) => document.querySelector(selector);
  $('#schema').textContent = schema.trim();
  $('#sql-editor').value = starterSql;
  $('#api-editor').value = starterApi;

  function showError(container, message) {
    container.className = 'message error';
    container.textContent = message;
  }

  $('#run-sql').addEventListener('click', () => {
    const button = $('#run-sql');
    const output = $('#sql-results');
    const status = $('#sql-status');
    button.disabled = true;
    status.textContent = 'Running…';
    const worker = new Worker(new URL('./sql-worker.js', import.meta.url), { type: 'module' });
    const finish = () => { clearTimeout(timer); worker.terminate(); button.disabled = false; };
    const timer = setTimeout(() => {
      finish();
      status.textContent = 'Timed out';
      showError(output, 'Query timed out. Check for a long-running query.');
    }, 20000);
    worker.onerror = () => {
      finish();
      status.textContent = 'Error';
      showError(output, 'The SQL worker could not start.');
    };
    worker.onmessage = ({ data }) => {
      finish();
      if (data.error) {
        status.textContent = 'Error';
        showError(output, data.error);
        return;
      }
      output.replaceChildren();
      output.className = 'table-wrap';
      if (!data.results.length) {
        output.className = 'empty';
        output.textContent = 'Query completed without a result set.';
        status.textContent = 'Complete';
        return;
      }
      let count = 0;
      for (const result of data.results) {
        const table = document.createElement('table');
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        for (const field of result.columns) {
          const th = document.createElement('th');
          th.textContent = field;
          headerRow.append(th);
        }
        const tbody = table.createTBody();
        for (const row of result.values) {
          const tr = tbody.insertRow();
          for (const value of row) {
            tr.insertCell().textContent = value === null ? 'NULL' : String(value);
          }
        }
        count += result.values.length;
        output.append(table);
      }
      status.textContent = `${count} ${count === 1 ? 'row' : 'rows'}`;
    };
    worker.postMessage($('#sql-editor').value);
  });

  $('#run-api').addEventListener('click', async () => {
    const button = $('#run-api');
    const output = $('#api-results');
    const status = $('#api-status');
    button.disabled = true;
    status.textContent = 'Running…';
    const result = await runApi($('#api-editor').value);
    button.disabled = false;
    if (result.error) {
      status.textContent = 'Error';
      showError(output, result.error);
      return;
    }
    output.className = 'test-list';
    output.replaceChildren();
    for (const test of result.results) {
      const item = document.createElement('div');
      item.className = 'test-item';
      const icon = document.createElement('span');
      icon.className = test.passed ? 'test-pass' : 'test-fail';
      icon.textContent = test.passed ? '✓' : '×';
      const content = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = test.name;
      const detail = document.createElement('p');
      detail.textContent = test.detail;
      content.append(name, detail);
      item.append(icon, content);
      output.append(item);
    }
    const passed = result.results.filter((test) => test.passed).length;
    status.textContent = `${passed} / ${result.results.length} passed`;
  });

  document.querySelector('#back-btn').addEventListener('click', () => {
    currentPage = PAGES.SELECTION;
    renderSelectionPage();
  });
}

function renderTesterAssessment() {
  app.innerHTML = `
    <header class="topbar"><div class="brand"><span class="brand-icon">R</span><span>RECRUITMENT <strong>LAB</strong></span></div><span class="top-tag">TESTER ASSESSMENT</span></header>
    <main>
      <div class="intro"><div><div class="eyebrow"><span class="dot"></span> PRACTICE ENVIRONMENT</div><h1>QA & Tester assessment</h1><p>Test your quality assurance and testing skills.</p></div></div>
      <section class="challenge">
        <div class="section-heading"><span class="number">01</span><div><div class="section-kicker">TESTING CHALLENGE</div><h2>Quality Assurance Test Cases</h2></div><span class="pill">QA <span>·</span> Testing</span></div>
        <p class="brief">Coming soon - Tester assessment challenges will be added here.</p>
      </section>
      <div style="text-align: center; margin-top: 30px;">
        <button id="back-btn" class="btn-back">← Back to Selection</button>
      </div>
      <footer>RECRUITMENT LAB <span>·</span> Tester assessment prototype</footer>
    </main>
  `;

  document.querySelector('#back-btn').addEventListener('click', () => {
    currentPage = PAGES.SELECTION;
    renderSelectionPage();
  });
}

renderLoginPage();
