import { getToken } from './auth.js';

const API_URL = 'http://localhost:1212/ekom';

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  options.headers = options.headers || {};
  options.headers['Content-Type'] = 'application/json';
  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error de API');
  return data;
}

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('border-palette-600', 'text-palette-600'));
    btn.classList.add('border-palette-600', 'text-palette-600');
  });
});

// Perfil
async function loadProfile() {
  const profile = await apiFetch('/profile/me');
  document.getElementById('name').value = profile.name || '';
  document.getElementById('lastname').value = profile.lastname || '';
  document.getElementById('bio').value = profile.bio || '';
  document.getElementById('avatar').value = profile.avatar || '';

  document.getElementById('profile-name').textContent = `${profile.name} ${profile.lastname}`;
  document.getElementById('profile-bio').textContent = profile.bio || 'Sin biografía';
  document.getElementById('profile-avatar').src = profile.avatar || 'img/default-avatar.png';
}

// Guardar perfil
document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    name: document.getElementById('name').value,
    lastname: document.getElementById('lastname').value,
    bio: document.getElementById('bio').value,
    avatar: document.getElementById('avatar').value,
  };
  await apiFetch('/profile/me', { method: 'PUT', body: JSON.stringify(body) });
  loadProfile();
});

// Publicaciones del usuario
async function loadMyPosts() {
  const posts = await apiFetch('/post/mine');
  const container = document.getElementById('my-posts');
  container.innerHTML = posts.map(p => `
    <div class="border rounded-lg p-4 shadow-sm bg-gray-50">
      <h4 class="font-semibold">${p.title}</h4>
      <p class="text-sm text-gray-600">${p.description}</p>
      <span class="text-palette-600 font-bold">$${p.price}</span>
    </div>
  `).join('');
}

// Valoraciones del usuario
async function loadMyRatings() {
  const ratings = await apiFetch('/rating/mine');
  const container = document.getElementById('my-ratings');
  container.innerHTML = ratings.map(r => `
    <div class="border rounded-lg p-4 shadow-sm bg-gray-50">
      <p class="font-medium">Post ID: ${r.postId}</p>
      <p class="text-yellow-500">Puntuación: ${'⭐'.repeat(r.score)}</p>
    </div>
  `).join('');
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadMyPosts();
  loadMyRatings();
  document.querySelector('[data-tab="info"]').click(); // abrir tab info por defecto
});
