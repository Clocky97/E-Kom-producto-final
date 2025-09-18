import { api } from "./api.js"

class AdminManager {
  constructor() {
    this.products = []
    this.users = []
    this.reports = []
    this.analytics = {}
    this.initialize()
  }

  async initialize() {
    this.bindEvents()
    await this.loadProducts()
    await this.loadUsers()
    await this.loadReports()
    await this.loadAnalytics()
  }

  bindEvents() {
    // Ejemplo: document.getElementById("admin-panel-btn")?.addEventListener("click", () => this.toggleAdminPanel())
  }

  async loadProducts() {
    try {
      this.products = await api.getProducts()
      // Render products in admin panel
      // this.renderProducts()
    } catch (error) {
      // Handle error
    }
  }

  async loadUsers() {
    try {
      this.users = await api.request("/user", { method: "GET" })
      // Render users in admin panel
      // this.renderUsers()
    } catch (error) {
      // Handle error
    }
  }

  async loadReports() {
    try {
      this.reports = await api.request("/report", { method: "GET" })
      // Render reports in admin panel
      // this.renderReports()
    } catch (error) {
      // Handle error
    }
  }

  async loadAnalytics() {
    // Si tienes un endpoint para analytics, consúmelo aquí
    // Ejemplo: this.analytics = await api.request("/analytics", { method: "GET" })
    this.analytics = {}
  }

  // Ejemplo de métodos de gestión de productos
  async editProduct(productId, productData) {
    try {
      await api.request(`/product/${productId}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      })
      await this.loadProducts()
    } catch (error) {
      // Handle error
    }
  }

  async deleteProduct(productId) {
    try {
      await api.request(`/product/${productId}`, {
        method: "DELETE",
      })
      await this.loadProducts()
    } catch (error) {
      // Handle error
    }
  }

  async addProduct(productData) {
    try {
      await api.request("/product", {
        method: "POST",
        body: JSON.stringify(productData),
      })
      await this.loadProducts()
    } catch (error) {
      // Handle error
    }
  }

  // Ejemplo de métodos de gestión de usuarios
  async editUser(userId, userData) {
    try {
      await api.request(`/user/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      })
      await this.loadUsers()
    } catch (error) {
      // Handle error
    }
  }

  async deleteUser(userId) {
    try {
      await api.request(`/user/${userId}`, {
        method: "DELETE",
      })
      await this.loadUsers()
    } catch (error) {
      // Handle error
    }
  }

  // Métodos para abrir/cerrar panel, etc.
  toggleAdminPanel() {
    // Implementa según tu UI
  }
  openAdminPanel() {
    // Implementa según tu UI
  }
  closeAdminPanel() {
    // Implementa según tu UI
  }
}

window.adminManager = new AdminManager()