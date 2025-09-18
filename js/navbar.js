import { AuthManager } from "./auth.js"

export class NavbarManager {
  constructor() {
    this.authManager = new AuthManager()
    this.bindEvents()
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById("search-input")
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        this.debounce((e) => {
          this.handleSearch(e.target.value)
        }, 300),
      )
    }

    // Cart button
    const cartBtn = document.getElementById("cart-btn")
    if (cartBtn) {
      cartBtn.addEventListener("click", () => {
        this.toggleCart()
      })
    }
  }

  handleSearch(query) {
    // Emit search event for other modules to listen
    const searchEvent = new CustomEvent("search", { detail: { query } })
    document.dispatchEvent(searchEvent)
  }

  toggleCart() {
    // Emit cart toggle event
    const cartEvent = new CustomEvent("toggleCart")
    document.dispatchEvent(cartEvent)
  }

  updateCartCount(count) {
    const cartCount = document.getElementById("cart-count")
    if (cartCount) {
      cartCount.textContent = count
      cartCount.classList.toggle("hidden", count === 0)
    }
  }

  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}
