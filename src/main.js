import './style.css';
import './login-styles.css';
import { 
  schema, 
  starterApi, 
  starterSql,
  performanceIssueCode,
  performanceIssueHint,
  runPerformanceTests,
  sqlInjectionCode,
  sqlInjectionHint,
  runSecurityTests,
  runApiTests
} from './challenges.js';
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
    <header class="topbar"><div class="brand"><span class="brand-icon">R</span><span>RECRUITMENT <strong>LAB</strong></span></div><span class="top-tag">DEVELOPER ASSESSMENT</span><div class="timer-display" id="timer-display">30:00</div></header>
    <main>
      <div class="intro"><div><div class="eyebrow"><span class="dot"></span> PRACTICE ENVIRONMENT</div><h1>Developer assessment</h1><p>Two practical challenges. One workspace. Show us how you solve real-world problems.</p></div><div class="intro-badge"><span>✦</span><div><strong>Your workspace</strong><small>Work at your own pace</small></div></div></div>
      <div class="overview"><span><strong>04</strong> challenges</span><span class="divider"></span><span>SQL · JavaScript · Java · C#</span><span class="divider"></span><span>Time limit: 30 minutes</span></div>
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
      <section class="challenge">
        <div class="section-heading"><span class="number orange">03</span><div><div class="section-kicker">PERFORMANCE CHALLENGE</div><h2>Optimize N+1 query problem</h2></div><span class="pill orange-pill">Java</span></div>
        <p class="brief">The <code>/api/orders</code> endpoint is taking 15+ seconds to return 1,000 orders. Review the code and fix the performance issue.</p>
        <div class="performance-spec">
          <div><strong>Problem:</strong></div>
          <p>The code fetches all orders, then queries the database again for each order to get customer details. This is an N+1 query problem.</p>
          <div><strong>Requirement:</strong></div>
          <p>Optimize the code to fetch all customer data in one or two database calls instead of 1,001 calls. Return the orders with customer names populated efficiently.</p>
        </div>
        <div class="code-editor editor-block"><div class="block-heading"><span>CODE EDITOR</span><span>orders-api.java</span></div><label class="sr-only" for="performance-editor">Performance issue code</label><textarea id="performance-editor" spellcheck="false" readonly></textarea><div class="editor-footer"><span>Identify and fix the N+1 query pattern</span><button id="run-performance">▶ &nbsp; Check solution</button></div></div>
        <div class="results-block"><div class="results-heading"><div><span class="result-icon">⚡</span><strong>Analysis results</strong></div><span id="performance-status" class="muted">Ready to run</span></div><div id="performance-results" class="empty">Submit your fix to see the analysis.</div></div>
      </section>
      <section class="challenge">
        <div class="section-heading"><span class="number red">04</span><div><div class="section-kicker">SECURITY CHALLENGE</div><h2>Fix SQL injection vulnerability</h2></div><span class="pill red-pill">C#</span></div>
        <p class="brief">A developer has written vulnerable code that searches customers by last name. Identify the security flaw and fix it.</p>
        <div class="security-spec">
          <div><strong>Security Issue:</strong></div>
          <p>User input is directly concatenated into SQL queries, making the code vulnerable to SQL injection attacks. Example: If lastName is <code>' OR '1'='1</code>, the entire database could be exposed.</p>
          <div><strong>Requirement:</strong></div>
          <p>Use parameterized queries to safely handle user input. Separate SQL logic from data.</p>
        </div>
        <div class="code-editor editor-block"><div class="block-heading"><span>CODE EDITOR</span><span>customer-search.cs</span></div><label class="sr-only" for="security-editor">SQL injection code</label><textarea id="security-editor" spellcheck="false" readonly></textarea><div class="editor-footer"><span>Fix the SQL injection vulnerability</span><button id="run-security">▶ &nbsp; Check solution</button></div></div>
        <div class="results-block"><div class="results-heading"><div><span class="result-icon">🔒</span><strong>Security audit</strong></div><span id="security-status" class="muted">Ready to run</span></div><div id="security-results" class="empty">Submit your fix to see the security audit.</div></div>
      </section>
      <div style="text-align: center; margin-top: 30px; display: flex; gap: 10px; justify-content: center;">
        <button id="home-btn" class="btn-home">🏠 Home</button>
        <button id="back-btn" class="btn-back">← Back to Selection</button>
      </div>
      <footer>RECRUITMENT LAB <span>·</span> Developer assessment prototype <span>·</span> Refreshing the page clears your work</footer>
    </main>
    <div id="time-up-dialog" class="modal hidden">
      <div class="modal-content">
        <div class="modal-icon">⏰</div>
        <h2>Assessment Time Over</h2>
        <p>Your 30-minute assessment time has ended. Your responses have been saved.</p>
        <button id="close-dialog-btn" class="btn-primary">OK</button>
      </div>
    </div>
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

  // Performance challenge
  $('#performance-editor').value = performanceIssueCode;
  
  $('#run-performance').addEventListener('click', async () => {
    const button = $('#run-performance');
    const output = $('#performance-results');
    const status = $('#performance-status');
    button.disabled = true;
    status.textContent = 'Analyzing…';
    const result = await runPerformanceTests($('#performance-editor').value);
    button.disabled = false;
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
    status.textContent = `${passed} / ${result.results.length} checks passed`;
  });

  // Security challenge
  $('#security-editor').value = sqlInjectionCode;
  
  $('#run-security').addEventListener('click', async () => {
    const button = $('#run-security');
    const output = $('#security-results');
    const status = $('#security-status');
    button.disabled = true;
    status.textContent = 'Auditing…';
    const result = await runSecurityTests($('#security-editor').value);
    button.disabled = false;
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
    status.textContent = `${passed} / ${result.results.length} checks passed`;
  });

  document.querySelector('#back-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    currentPage = PAGES.SELECTION;
    renderSelectionPage();
  });

  document.querySelector('#home-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    currentPage = PAGES.SELECTION;
    renderSelectionPage();
  });

  // Timer functionality
  const ASSESSMENT_TIME = 30 * 60; // 30 minutes in seconds
  let timeRemaining = ASSESSMENT_TIME;
  let timerInterval = null;

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    const timerDisplay = $('#timer-display');
    timerDisplay.textContent = formatTime(timeRemaining);
    
    if (timeRemaining <= 60) {
      timerDisplay.classList.add('timer-warning');
    }
    if (timeRemaining <= 0) {
      timerDisplay.classList.add('timer-expired');
    }
  }

  function showTimeUpDialog() {
    clearInterval(timerInterval);
    const dialog = $('#time-up-dialog');
    dialog.classList.remove('hidden');
    
    document.querySelector('#close-dialog-btn').addEventListener('click', () => {
      currentPage = PAGES.SELECTION;
      renderSelectionPage();
    });
  }

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
      showTimeUpDialog();
    }
  }, 1000);

  updateTimerDisplay();
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
