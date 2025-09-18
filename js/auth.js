import { api } from "./api.js"
import { API_CONFIG } from "./config.js"

// Authentication state
export const authState = {
  isAuthenticated: false,
  currentUser: null,
}

// Utility functions
const utils = {
  showToast: (message, type = "info") => {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.id = "toast-container"
      toastContainer.className = "fixed top-4 right-4 z-50 space-y-2"
      document.body.appendChild(toastContainer)
    }

    const toast = document.createElement("div")
    const bgColor = type === "error" ? "bg-red-500" : type === "success" ? "bg-green-500" : "bg-blue-500"
    toast.className = `${bgColor} text-white px-4 py-2 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`
    toast.textContent = message

    toastContainer.appendChild(toast)

    // Animate in
    setTimeout(() => {
      toast.classList.remove("translate-x-full")
    }, 10)

    // Remove after 4 seconds
    setTimeout(() => {
      toast.classList.add("translate-x-full")
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, 4000)
  },

  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isValidPassword: (password) => password.length >= 6,
}

export class AuthManager {
  constructor() {
    this.initializeAuth()
    this.bindEvents()
    this.bindForms()
  }

  // Initialize authentication state from localStorage
  initializeAuth() {
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN)
    const userData = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA)

    if (token && userData) {
      try {
        authState.currentUser = JSON.parse(userData)
        authState.isAuthenticated = true
        this.updateUI()
      } catch (error) {
        console.error("Error parsing user data:", error)
        this.logout()
      }
    }
  }

  // Bind authentication events
  bindEvents() {
    // Logout button
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout())
    }
  }

  // Bind login and register forms if present
  bindForms() {
    // Register form
    const registerForm = document.getElementById("register-form")
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(registerForm)
        const userData = {
          username: formData.get("username"),
          email: formData.get("email"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
        }
        await this.handleRegister(userData)
      })
    }

    // Login form
    const loginForm = document.getElementById("login-form")
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(loginForm)
        const email = formData.get("email")
        const password = formData.get("password")
        await this.handleLogin(email, password)
      })
    }
  }

  // Handle login (for login.html page)
  async handleLogin(email, password) {
    // Validation
    if (!email || !password) {
      utils.showToast("Por favor completa todos los campos", "error")
      return false
    }

    if (!utils.isValidEmail(email)) {
      utils.showToast("Por favor ingresa un email válido", "error")
      return false
    }

    try {
      const response = await api.login(email, password)

      // Backend returns { accessToken, refreshToken, user }
      if (response.accessToken && response.refreshToken) {
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.accessToken)
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
        authState.currentUser = response.user
        authState.isAuthenticated = true

        utils.showToast("¡Inicio de sesión exitoso!", "success")

        // Redirect to main page
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1000)

        return true
      } else {
        utils.showToast("Respuesta inválida del servidor", "error")
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      utils.showToast(error.message || "Error al iniciar sesión. Intenta de nuevo.", "error")
      return false
    }
  }

  // Handle register (for register.html page)
  async handleRegister(userData) {
    // Validation
    if (!userData.username || !userData.email || !userData.password || !userData.confirmPassword) {
      utils.showToast("Por favor completa todos los campos", "error")
      return false
    }

    if (!utils.isValidEmail(userData.email)) {
      utils.showToast("Por favor ingresa un email válido", "error")
      return false
    }

    if (!utils.isValidPassword(userData.password)) {
      utils.showToast("La contraseña debe tener al menos 6 caracteres", "error")
      return false
    }

    if (userData.password !== userData.confirmPassword) {
      utils.showToast("Las contraseñas no coinciden", "error")
      return false
    }

    try {
      // Backend expects { username, email, password }
      const response = await api.register({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      })

      // Backend returns { accessToken, refreshToken, user }
      if (response.accessToken && response.refreshToken) {
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.accessToken)
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
        authState.currentUser = response.user
        authState.isAuthenticated = true

        utils.showToast("¡Registro exitoso!", "success")

        // Redirect to main page
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1000)

        return true
      } else {
        utils.showToast("Respuesta inválida del servidor", "error")
        return false
      }
    } catch (error) {
      console.error("Registration error:", error)
      utils.showToast(error.message || "Error en el registro. Intenta de nuevo.", "error")
      return false
    }
  }

  // Logout user
  async logout() {
    try {
      await api.logout()
      utils.showToast("Sesión cerrada exitosamente", "success")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA)
      authState.currentUser = null
      authState.isAuthenticated = false

      this.updateUI()

      // Redirect to main page if on a protected page
      if (window.location.pathname !== "/index.html" && window.location.pathname !== "/") {
        window.location.href = "index.html"
      }
    }
  }

  // Update UI based on authentication state
  updateUI() {
    const authButtons = document.getElementById("auth-buttons")
    const userMenu = document.getElementById("user-menu")
    const userName = document.getElementById("user-name")

    if (authState.isAuthenticated && authState.currentUser) {
      // Show user menu, hide auth buttons
      if (authButtons) authButtons.classList.add("hidden")
      if (userMenu) userMenu.classList.remove("hidden")
      if (userName) userName.textContent = authState.currentUser.username || authState.currentUser.email
    } else {
      // Show auth buttons, hide user menu
      if (authButtons) authButtons.classList.remove("hidden")
      if (userMenu) userMenu.classList.add("hidden")
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return authState.isAuthenticated
  }

  // Get current user
  getCurrentUser() {
    return authState.currentUser
  }

  // Check if user has admin role
  isAdmin() {
    return authState.currentUser && authState.currentUser.role === "admin"
  }
}