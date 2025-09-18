import { API_CONFIG } from "./config.js"

export class APIService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN)
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    }
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    defaultOptions.signal = controller.signal

    try {
      const response = await fetch(url, defaultOptions)
      clearTimeout(timeoutId)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error desconocido")
      }
      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async login(email, password) {
    return await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData) {
    console.log("Registering user:", userData);
    return await this.request(API_CONFIG.ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return await this.request(API_CONFIG.ENDPOINTS.LOGOUT, {
      method: "POST",
    })
  }

  async getProfile() {
    return await this.request(API_CONFIG.ENDPOINTS.PROFILE, {
      method: "GET",
    })
  }

  async getProducts(params = {}) {
    return await this.request(API_CONFIG.ENDPOINTS.PRODUCTS, {
      method: "GET",
    })
  }

  async getProduct(id) {
    return await this.request(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, {
      method: "GET",
    })
  }

  async getPosts(params = {}) {
    return await this.request(API_CONFIG.ENDPOINTS.POSTS, {
      method: "GET",
    })
  }

  async getCategories() {
    return await this.request(API_CONFIG.ENDPOINTS.CATEGORIES, {
      method: "GET",
    })
  }

  async getRatings(postId) {
    return await this.request(`${API_CONFIG.ENDPOINTS.RATINGS}/${postId}`, {
      method: "GET",
    })
  }

  async addRating(ratingData) {
    return await this.request(API_CONFIG.ENDPOINTS.RATINGS, {
      method: "POST",
      body: JSON.stringify(ratingData),
    })
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN)
    return await this.request(API_CONFIG.ENDPOINTS.REFRESH, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  }
}

export const api = new APIService()