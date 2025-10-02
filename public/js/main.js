import { getToken } from './auth.js';

const API_URL = 'http://localhost:1212/ekom';
let currentUser = null;

// --- Helper fetch ---
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  options.headers = options.headers || {};
  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error de API');
  return data;
}

// --- Verificar usuario logeado ---
async function checkUser() {
  try {
    const user = await apiFetch('/user/me');
    currentUser = user;
  } catch {
    currentUser = null;
  }
  updateNavbar();
}

// --- Navbar dinámico ---
function updateNavbar() {
  const authButtons = document.getElementById('auth-buttons');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');

  if (currentUser) {
    authButtons.classList.add('hidden');
    userMenu.classList.remove('hidden');
    userName.textContent = currentUser.name;

    if (!document.getElementById('profile-btn')) {
      const profileBtn = document.createElement('a');
      profileBtn.href = 'profile.html';
      profileBtn.id = 'profile-btn';
      profileBtn.className = 'px-4 py-2 bg-palette-600 text-white rounded-lg hover:bg-palette-500 transition-colors';
      profileBtn.textContent = 'Perfil';
      userMenu.insertAdjacentElement('beforebegin', profileBtn);
    }

    if (!document.getElementById('new-post-btn')) {
      const newPostBtn = document.createElement('button');
      newPostBtn.id = 'new-post-btn';
      newPostBtn.className = 'px-4 py-2 bg-palette-600 text-white rounded-lg hover:bg-palette-500 transition-colors';
      newPostBtn.textContent = 'Nueva Publicación';
      newPostBtn.addEventListener('click', openNewPostModal);
      userMenu.insertAdjacentElement('beforebegin', newPostBtn);
    }
  } else {
    authButtons.classList.remove('hidden');
    userMenu.classList.add('hidden');

    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) profileBtn.remove();
    const newPostBtn = document.getElementById('new-post-btn');
    if (newPostBtn) newPostBtn.remove();
  }
}

// --- Modal Nueva Publicación ---
function openNewPostModal() { document.getElementById('new-post-modal').classList.remove('hidden'); }
document.getElementById('close-new-post').addEventListener('click', () => {
  document.getElementById('new-post-modal').classList.add('hidden');
});
document.getElementById('new-post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('post-title').value;
  const description = document.getElementById('post-desc').value;
  const price = parseFloat(document.getElementById('post-price').value);

  try {
    await apiFetch('/post', {
      method: 'POST',
      body: JSON.stringify({ title, description, price }),
      headers: { 'Content-Type': 'application/json' },
    });
    document.getElementById('new-post-modal').classList.add('hidden');
    loadFeed();
  } catch (err) { alert('Error al crear publicación: ' + err.message); }
});

// --- Categorías ---
async function loadCategories() {
  try {
    const categories = await apiFetch('/category');
    const list = document.getElementById('categories-list');
    if (list) list.innerHTML = categories.map(cat =>
      `<li><a href="#" data-category="${cat.id}" class="block px-3 py-2 text-gray-700 hover:bg-palette-100 rounded-md transition-colors">${cat.name}</a></li>`
    ).join('');
  } catch (err) { console.error('Error cargando categorías:', err); }
}

// --- Feed productos ---
async function loadFeed(sort = 'newest', category = null) {
  try {
    let posts = await apiFetch('/post');
    if (category) posts = posts.filter(p => p.categoryId === category);

    switch(sort) {
      case 'price-low': posts.sort((a,b)=>a.price-b.price); break;
      case 'price-high': posts.sort((a,b)=>b.price-a.price); break;
      case 'oldest': posts.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)); break;
      default: posts.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    }

    const feed = document.getElementById('posts-feed');
    if (feed) feed.innerHTML = posts.map(post => renderPost(post)).join('');
  } catch (err) { console.error('Error cargando feed:', err); }
}

function renderPost(post) {
  return `<div class="bg-white rounded-lg shadow p-4">
    <h3 class="font-bold text-lg mb-2">${post.title||'Producto'}</h3>
    <p>${post.description||''}</p>
    <div class="mt-2 flex justify-between items-center">
      <span class="font-semibold">$${post.price?.toFixed(2)||'0.00'}</span>
      <button class="add-cart-btn px-3 py-1 bg-palette-600 text-white rounded" data-id="${post.id}">Agregar al carrito</button>
    </div>
  </div>`;
}

// --- Carrito ---
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }
function updateCartUI() {
  const count = document.getElementById('cart-count');
  const items = document.getElementById('cart-items');
  const total = document.getElementById('cart-total');
  const empty = document.getElementById('cart-empty');

  if(count) count.textContent = cart.reduce((sum,i)=>sum+i.quantity,0);
  if(items) items.innerHTML = cart.map(item => `
    <div class="flex justify-between items-center border-b py-2">
      <div>
        <p class="font-medium">${item.title}</p>
        <p class="text-sm text-gray-500">$${item.price.toFixed(2)} x ${item.quantity}</p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="decrease px-2 py-1 border rounded" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="increase px-2 py-1 border rounded" data-id="${item.id}">+</button>
        <button class="remove-cart-btn text-red-500" data-id="${item.id}">x</button>
      </div>
    </div>`).join('');

  if(total) total.textContent = cart.reduce((sum,i)=>sum+i.price*i.quantity,0).toFixed(2);
  if(empty) empty.classList.toggle('hidden', cart.length>0);
}

function setupCartEvents() {
  document.addEventListener('click', e => {
    if(e.target.classList.contains('add-cart-btn')) {
      const id = Number(e.target.dataset.id);
      apiFetch(`/post/${id}`).then(post => {
        const item = cart.find(i=>i.id===post.id);
        if(item) item.quantity++; else cart.push({...post, quantity:1});
        saveCart(); updateCartUI();
      });
    }
    if(e.target.classList.contains('remove-cart-btn')) {
      const id = Number(e.target.dataset.id); cart = cart.filter(i=>i.id!==id); saveCart(); updateCartUI();
    }
    if(e.target.classList.contains('increase')) {
      const id = Number(e.target.dataset.id); const item = cart.find(i=>i.id===id); if(item) item.quantity++; saveCart(); updateCartUI();
    }
    if(e.target.classList.contains('decrease')) {
      const id = Number(e.target.dataset.id); const item = cart.find(i=>i.id===id);
      if(item){ item.quantity--; if(item.quantity<=0) cart = cart.filter(i=>i.id!==id);}
      saveCart(); updateCartUI();
    }
  });
}

function setupCartSlider() {
  const cartBtn = document.getElementById('cart-btn');
  const cartSlider = document.getElementById('cart-slider');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCart = document.getElementById('close-cart');

  function openCart(){ cartSlider.classList.remove('translate-x-full'); cartOverlay.classList.remove('hidden'); }
  function closeCartFn(){ cartSlider.classList.add('translate-x-full'); cartOverlay.classList.add('hidden'); }

  if(cartBtn) cartBtn.addEventListener('click', openCart);
  if(closeCart) closeCart.addEventListener('click', closeCartFn);
  if(cartOverlay) cartOverlay.addEventListener('click', closeCartFn);
}

function setupFilters() {
  const sortSelect = document.getElementById('sort-select');
  const catList = document.getElementById('categories-list');
  if(sortSelect) sortSelect.addEventListener('change', e=>loadFeed(e.target.value));
  if(catList) catList.addEventListener('click', e=>{
    if(e.target.dataset.category) loadFeed('newest', Number(e.target.dataset.category));
  });
}

// --- Inicialización ---
window.addEventListener('DOMContentLoaded', () => {
  checkUser();
  loadCategories();
  loadFeed();
  updateCartUI();
  setupCartEvents();
  setupCartSlider();
  setupFilters();
});
