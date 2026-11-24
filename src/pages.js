// Page routing and management
export const PAGES = {
  LOGIN: 'login',
  SELECTION: 'selection',
  DEVELOPER: 'developer',
  TESTER: 'tester'
};

export function showLoginPage() {
  return `
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">Rubaiyat's IT Candidate Selection App</h1>
        <div class="login-tiles">
          <div class="tile" id="candidate-tile"><h2>Candidate login</h2><p>Take your assessment</p></div>
          <div class="tile" id="admin-tile"><h2>Admin login</h2><p>Manage candidate access</p></div>
        </div>
      </div>
    </div>
  `;
}

export function showCredentialsForm(role) {
  const isAdmin = role === 'admin';
  return `
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">${isAdmin ? 'Admin login' : 'Candidate login'}</h1>
        <form id="login-form">
          ${isAdmin ? '' : `<div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" required />
          </div>`}
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Login</button>
            <button type="button" class="btn-secondary" id="cancel-btn">Back</button>
          </div>
        </form>
        <div id="login-error" class="error-message"></div>
      </div>
    </div>
  `;
}

export function showAdminPage() {
  return `
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">Candidate credentials</h1>
        <form id="admin-form">
          <div class="form-group">
            <label for="cand-username">Candidate username</label>
            <input type="text" id="cand-username" autocomplete="off" required />
          </div>
          <div class="form-group">
            <label for="cand-password">Candidate password</label>
            <input type="text" id="cand-password" autocomplete="off" minlength="8" required />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" id="generate-btn">Generate random</button>
            <button type="submit" class="btn-primary">Save</button>
          </div>
          <button type="button" class="btn-secondary" id="admin-logout-btn">Logout</button>
        </form>
        <div id="admin-message" class="error-message"></div>
        <h2 class="login-title admin-subtitle">Change admin password</h2>
        <form id="admin-password-form">
          <div class="form-group">
            <label for="admin-current">Current admin password</label>
            <input type="password" id="admin-current" autocomplete="current-password" required />
          </div>
          <div class="form-group">
            <label for="admin-new">New admin password (min 12 characters)</label>
            <input type="password" id="admin-new" autocomplete="new-password" minlength="12" required />
          </div>
          <button type="submit" class="btn-primary">Change admin password</button>
        </form>
        <div id="admin-password-message" class="error-message"></div>
      </div>
    </div>
  `;
}

export function showSelectionPage(onSelectRole) {
  return `
    <div class="selection-container">
      <header class="topbar"><div class="brand"><span class="brand-icon">R</span><span>RECRUITMENT <strong>LAB</strong></span></div></header>
      <main class="selection-main">
        <div class="selection-header">
          <h1>Select Assessment Type</h1>
          <p>Choose which assessment you would like to take</p>
        </div>
        <div class="tiles-container">
          <div class="tile" id="developer-tile">
            <div class="tile-icon">👨‍💻</div>
            <h2>Developer Assessment</h2>
            <p>SQL and JavaScript challenges</p>
          </div>
          <div class="tile" id="tester-tile">
            <div class="tile-icon">🧪</div>
            <h2>Tester Assessment</h2>
            <p>Testing and QA challenges</p>
          </div>
        </div>
        <button id="logout-btn" class="btn-logout">Logout</button>
      </main>
    </div>
  `;
}
