// main.js - Feed, categorías, productos, carrito, ratings
import { getToken } from './auth.js';

const API_URL = 'http://localhost:1212/ekom';

// Helper para requests autenticados
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  options.headers = options.headers || {};
  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error de API');
  return data;
}

// Cargar categorías
async function loadCategories() {
  try {
    const categories = await apiFetch('/category');
    const list = document.getElementById('categories-list');
    if (list) {
      list.innerHTML = categories.map(cat => `<li><a href="#" data-category="${cat.id}" class="block px-3 py-2 text-gray-700 hover:bg-palette-100 rounded-md transition-colors">${cat.name}</a></li>`).join('');
    }
  } catch {}
}

// Cargar productos/feed
async function loadFeed(sort = 'newest', category = null) {
  try {
    const posts = await apiFetch('/post');
    let filtered = posts;
    if (category) filtered = filtered.filter(p => p.categoryId === category);
    // TODO: aplicar sort
    const feed = document.getElementById('posts-feed');
    if (feed) {
      feed.innerHTML = filtered.map(post => renderPost(post)).join('');
    }
  } catch {}
}

function renderPost(post) {
  return `<div class="bg-white rounded-lg shadow p-4">
    <h3 class="font-bold text-lg mb-2">${post.title || 'Producto'}</h3>
    <p>${post.description || ''}</p>
    <div class="mt-2 flex justify-between items-center">
      <span class="font-semibold">$${post.price || '0.00'}</span>
      <button class="add-cart-btn px-3 py-1 bg-palette-600 text-white rounded" data-id="${post.id}">Agregar al carrito</button>
    </div>
  </div>`;
}

// Carrito
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
function updateCartUI() {
  const count = document.getElementById('cart-count');
  if (count) count.textContent = cart.length;
  const items = document.getElementById('cart-items');
  if (items) {
    items.innerHTML = cart.map(item => `<div class="flex justify-between items-center">
      <span>${item.title}</span>
      <span>$${item.price}</span>
      <button class="remove-cart-btn text-red-500" data-id="${item.id}">Quitar</button>
    </div>`).join('');
  }
  const total = document.getElementById('cart-total');
  if (total) total.textContent = cart.reduce((sum, i) => sum + Number(i.price), 0).toFixed(2);
  document.getElementById('cart-empty').classList.toggle('hidden', cart.length > 0);
}

// Eventos de agregar/quitar carrito
function setupCartEvents() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-cart-btn')) {
      const id = e.target.dataset.id;
      // Buscar el post en el feed
      apiFetch(`/post/${id}`).then(post => {
        cart.push(post);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
      });
    }
    if (e.target.classList.contains('remove-cart-btn')) {
      const id = e.target.dataset.id;
      cart = cart.filter(i => i.id != id);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    }
  });
}

// Filtros y orden
function setupFilters() {
  document.getElementById('sort-select').addEventListener('change', (e) => {
    loadFeed(e.target.value);
  });
  document.getElementById('categories-list').addEventListener('click', (e) => {
    if (e.target.dataset.category) {
      loadFeed('newest', Number(e.target.dataset.category));
    }
  });
}

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadFeed();
  updateCartUI();
  setupCartEvents();
  setupFilters();
});
