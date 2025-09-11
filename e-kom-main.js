const API_URL = "http://localhost:3000/api"; // Cambia si tu backend usa otro puerto

let accessToken = null;

// Persistencia de sesión
window.onload = () => {
  accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("posts").style.display = "block";
    loadPosts();
  }
};

// LOGIN
document.getElementById("loginForm").onsubmit = async e => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.accessToken) {
    accessToken = data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    document.getElementById("auth").style.display = "none";
    document.getElementById("posts").style.display = "block";
    loadPosts();
  } else {
    alert(data.error || "Error al iniciar sesión");
  }
};

// REGISTRO
document.getElementById("registerForm").onsubmit = async e => {
  e.preventDefault();
  const username = registerUsername.value;
  const email = registerEmail.value;
  const password = registerPassword.value;
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, email, password })
  });
  const data = await res.json();
  if (data.message) {
    alert("Registro exitoso, ahora inicia sesión.");
  } else {
    alert(data.error || "Error al registrarse");
  }
};

// LOGOUT
document.getElementById("logoutBtn").onclick = () => {
  accessToken = null;
  localStorage.removeItem("accessToken");
  document.getElementById("auth").style.display = "block";
  document.getElementById("posts").style.display = "none";
};

// CARGAR PUBLICACIONES
async function loadPosts() {
  if (!accessToken) return;
  const res = await fetch(`${API_URL}/post`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const posts = await res.json();
  const postList = document.getElementById("postList");
  postList.innerHTML = "";
  for (const post of posts) {
    // Obtener promedio de estrellas
    const avgRes = await fetch(`${API_URL}/post/${post.id}/average-rating`);
    const avgData = await avgRes.json();
    const stars = "★".repeat(Math.round(avgData.average)) + "☆".repeat(5 - Math.round(avgData.average));
    postList.innerHTML += `
      <div>
        <h3>${post.titulo || post.title}</h3>
        <p>${post.content}</p>
        <div>
          Puntuación: <span class="star">${stars}</span> (${avgData.average})
        </div>
        <div>
          Califica:
          <span>
            ${[1,2,3,4,5].map(n => `<span class="star" onclick="ratePost(${post.id},${n})">★</span>`).join('')}
          </span>
        </div>
        <div>
          <button onclick="showReportForm(${post.id})">Reportar</button>
          <div id="report-form-${post.id}" style="display:none;">
            <input type="text" id="reason-${post.id}" placeholder="Motivo del reporte">
            <button onclick="sendReport(${post.id})">Enviar</button>
          </div>
        </div>
      </div>
      <hr>
    `;
  }
}

// Calificar post
window.ratePost = async (postId, score) => {
  const res = await fetch(`${API_URL}/rating`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ postId, score })
  });
  const data = await res.json();
  if (data.error) {
    alert(data.error);
  } else {
    loadPosts();
  }
};

// Mostrar formulario de reporte
window.showReportForm = function(postId) {
  document.getElementById(`report-form-${postId}`).style.display = "block";
};

// Enviar reporte
window.sendReport = async function(postId) {
  const reason = document.getElementById(`reason-${postId}`).value;
  if (!reason) {
    alert("Por favor, escribe un motivo.");
    return;
  }
  const res = await fetch(`${API_URL}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ postId, reason })
  });
  const data = await res.json();
  if (data.error) {
    alert(data.error);
  } else {
    alert("Reporte enviado. ¡Gracias!");
    document.getElementById(`report-form-${postId}`).style.display = "none";
    document.getElementById(`reason-${postId}`).value = "";
  }
};