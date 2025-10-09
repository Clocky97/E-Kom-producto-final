// auth.js - Manejo de login, registro y logout

const API_URL = 'http://localhost:1212/ekom';

// Helpers
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }
}
function hideError() {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) errorDiv.classList.add('hidden');
}
function setLoading(btn, loading) {
  if (!btn) return;
  btn.querySelector('.btn-text').classList.toggle('hidden', loading);
  btn.querySelector('.btn-loading').classList.toggle('hidden', !loading);
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    const btn = loginForm.querySelector('button');
    setLoading(btn, true);
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error de login');
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      window.location.href = 'index.html';
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(btn, false);
    }
  });
}

// Registro
const registerForm = document.getElementById('register-form');
console.log("probar si funca")
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = registerForm.querySelector('button');
    setLoading(btn, true);
    const username = registerForm.username.value;
    const name = registerForm.name.value;
    const lastname = registerForm.lastname.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, lastname, email, password })
      });
        const data = await res.json();
        console.log(data);

      if (!res.ok) throw new Error((data && data.error) || 'Error de registro');
      window.location.href = 'login.html';
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(btn, false);
    }
  });
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
    } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = 'index.html';
  });
}

// Helper para obtener el token
export function getToken() {
  return localStorage.getItem('accessToken');
}
