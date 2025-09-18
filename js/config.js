// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://localhost:1212/ekom",
  ENDPOINTS: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
    PROFILE: "/profile",
    USERS: "/user",
    PRODUCTS: "/product",
    POSTS: "/post",
    CATEGORIES: "/category",
    RATINGS: "/rating",
    REPORTS: "/report",
    REFRESH: "/refresh",
  },
  TIMEOUT: 10000,
  DEFAULT_PAGE_SIZE: 12,
  STORAGE_KEYS: {
    AUTH_TOKEN: "ekom_auth_token",
    REFRESH_TOKEN: "ekom_refresh_token",
    USER_DATA: "ekom_user_data",
    CART_ITEMS: "ekom_cart_items",
  },
}

// Application state
export const APP_STATE = {
  currentUser: null,
  isAuthenticated: false,
  cartItems: [],
  currentPage: 1,
  isLoading: false,
  searchQuery: "",
  selectedCategory: "all",
  sortBy: "newest",
}

// Utility functions
export const Utils = {
  // Show loading overlay
  showLoading() {
    const overlay = document.getElementById("loading-overlay")
    if (overlay) {
      overlay.classList.remove("hidden")
    }
  },

  // Hide loading overlay
  hideLoading() {
    const overlay = document.getElementById("loading-overlay")
    if (overlay) {
      overlay.classList.add("hidden")
    }
  },

  // Show toast notification
  showToast(message, type = "info") {
    // Create toast element if it doesn't exist
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
  },

  // Format price
  formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  },

  // Format date
  formatDate(dateString) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString))
  },

  // Debounce function
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
  },

  // Generate star rating HTML
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
  },

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate password strength
  isValidPassword(password) {
    return password.length >= 6
  },
}
