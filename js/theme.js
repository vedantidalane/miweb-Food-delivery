// ── THEME ──
function initTheme() {
  const saved = localStorage.getItem('foodrush_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}
function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('foodrush_theme', next);
}
initTheme();

// ── AUTH ──
function checkAuth() {
  const user = JSON.parse(sessionStorage.getItem('foodrush_user') || 'null');
  const nav = document.getElementById('authNav');
  if (!nav) return;
  if (user) {
    nav.innerHTML = `<a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"><i class="fas fa-user-circle me-1"></i>${user.name}</a>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="#"><i class="fas fa-box me-2"></i>My Orders</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
      </ul>`;
  }
}
function logout() { sessionStorage.removeItem('foodrush_user'); window.location.href = 'login.html'; }

// ── TOAST ──
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const colors = { success:'bg-success', danger:'bg-danger', warning:'bg-warning text-dark', info:'bg-info' };
  const id = 'toast-' + Date.now();
  container.insertAdjacentHTML('beforeend', `<div id="${id}" class="toast align-items-center text-white ${colors[type]} border-0 show mb-2" role="alert">
    <div class="d-flex"><div class="toast-body">${msg}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="document.getElementById('${id}').remove()"></button></div></div>`);
  setTimeout(() => { const el = document.getElementById(id); if(el) el.remove(); }, 3000);
}
