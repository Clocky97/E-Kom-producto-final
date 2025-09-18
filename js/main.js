// Main application initialization
class EkomApp {
  constructor() {
    this.initialize()
  }

  // Initialize the application
  async initialize() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.initializeApp())
      } else {
        this.initializeApp()
      }
    } catch (error) {
      console.error("Error initializing app:", error)
    }
  }

  // Initialize app components
  async initializeApp() {
    try {
      // Initialize global state
      this.initializeGlobalState()

      // Initialize components in order
      await this.initializeAuth()
      await this.initializeFeed()
      await this.initializeCart()
      await this.initializeUI()

      // Setup global event listeners
      this.setupGlobalEvents()

      console.log("Ekom app initialized successfully")
    } catch (error) {
      console.error("Error during app initialization:", error)
      this.showInitializationError()
    }
  }

  // Initialize global state
  initializeGlobalState() {
    // Ensure global state exists
    if (!window.APP_STATE) {
      window.APP_STATE = {
        currentUser: null,
        isAuthenticated: false,
        cartItems: [],
        currentPage: 1,
        isLoading: false,
        searchQuery: "",
        selectedCategory: "all",
        sortBy: "newest",
      }
    }

    // Ensure API config exists
    if (!window.API_CONFIG) {
      window.API_CONFIG = {
        BASE_URL: "/ekom",
        DEFAULT_PAGE_SIZE: 12,
        STORAGE_KEYS: {
          AUTH_TOKEN: "ekom_auth_token",
          USER_DATA: "ekom_user_data",
          CART_ITEMS: "ekom_cart_items",
        },
      }
    }

    // Ensure Utils exists
    if (!window.Utils) {
      window.Utils = {
        showToast: this.showToast,
        formatPrice: this.formatPrice,
        generateStars: this.generateStars,
        debounce: this.debounce,
        isValidEmail: this.isValidEmail,
        isValidPassword: this.isValidPassword,
      }
    }
  }

  // Initialize authentication
  async initializeAuth() {
    // Auth manager should already be initialized from auth.js
    if (window.authManager) {
      console.log("Auth manager already initialized")
    } else {
      console.warn("Auth manager not found")
    }
  }

  // Initialize feed
  async initializeFeed() {
    // Feed manager should already be initialized from feed.js
    if (window.feedManager) {
      console.log("Feed manager already initialized")
    } else {
      console.warn("Feed manager not found")
    }
  }

  // Initialize cart
  async initializeCart() {
    // Cart manager should already be initialized from cart.js
    if (window.cartManager) {
      console.log("Cart manager already initialized")
    } else {
      console.warn("Cart manager not found")
    }
  }

  // Initialize UI
  async initializeUI() {
    // UI manager should already be initialized from ui.js
    if (window.uiManager) {
      console.log("UI manager already initialized")
    } else {
      console.warn("UI manager not found")
    }
  }

  // Setup global event listeners
  setupGlobalEvents() {
    // Handle window resize
    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.handleWindowResize()
      }, 250),
    )

    // Handle online/offline status
    window.addEventListener("online", () => {
      this.showToast("Connection restored", "success")
    })

    window.addEventListener("offline", () => {
      this.showToast("Connection lost", "error")
    })

    // Handle visibility change (tab switching)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        // Tab became visible, refresh data if needed
        this.handleTabVisible()
      }
    })
  }

  // Handle window resize
  handleWindowResize() {
    // Close mobile menus/modals on resize
    if (window.innerWidth > 768) {
      // Close mobile-specific UI elements
      const cartSlider = document.getElementById("cart-slider")
      if (cartSlider && cartSlider.classList.contains("open")) {
        window.cartManager?.closeCart()
      }
    }
  }

  // Handle tab becoming visible
  handleTabVisible() {
    // Optionally refresh data when user returns to tab
    // This could be useful for real-time updates
  }

  // Show initialization error
  showInitializationError() {
    const errorHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #f7fafc;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <div style="
                    text-align: center;
                    padding: 2rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    max-width: 400px;
                ">
                    <i class="fas fa-exclamation-triangle" style="
                        font-size: 3rem;
                        color: #e53e3e;
                        margin-bottom: 1rem;
                    "></i>
                    <h2 style="margin-bottom: 1rem; color: #2d3748;">Initialization Error</h2>
                    <p style="margin-bottom: 1.5rem; color: #4a5568;">
                        There was an error loading the application. Please refresh the page to try again.
                    </p>
                    <button onclick="window.location.reload()" style="
                        background: #3182ce;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        Refresh Page
                    </button>
                </div>
            </div>
        `

    document.body.insertAdjacentHTML("beforeend", errorHTML)
  }

  // Utility methods
  showToast(message, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.id = "toast-container"
      toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `
      document.body.appendChild(toastContainer)
    }

    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.style.cssText = `
            background: ${type === "error" ? "#e53e3e" : type === "success" ? "#38a169" : "#3182ce"};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `
    toast.textContent = message

    toastContainer.appendChild(toast)

    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateX(0)"
    }, 10)

    // Remove after 4 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, 4000)
  }

  formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  generateStars(rating, maxRating = 5) {
    let starsHtml = ""
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star star"></i>'
    }

    if (hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt star"></i>'
    }

    const emptyStars = maxRating - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star star empty"></i>'
    }

    return starsHtml
  }

  debounce(func, wait) {
    let timeout
    return function (...args) {
      
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  isValidPassword(password) {
    return password.length >= 6
  }
}

// Initialize the application
const ekomApp = new EkomApp()
