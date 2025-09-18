// UI Manager for handling general UI interactions
class UIManager {
  constructor() {
    this.bindEvents()
    this.initializeSearch()
  }

  // Bind general UI events
  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById("search-input")
    const searchBtn = document.getElementById("search-btn")

    if (searchInput) {
      const debouncedSearch = this.debounce((query) => {
        this.handleSearch(query)
      }, 500)

      searchInput.addEventListener("input", (e) => {
        debouncedSearch(e.target.value.trim())
      })

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          this.handleSearch(e.target.value.trim())
        }
      })
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const query = searchInput ? searchInput.value.trim() : ""
        this.handleSearch(query)
      })
    }

    // Sort functionality
    const sortSelect = document.getElementById("sort-select")
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.handleSort(e.target.value)
      })
    }

    // Sidebar filters
    const sidebarLinks = document.querySelectorAll(".sidebar-menu a[data-filter]")
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        this.handleFilter(e.target.dataset.filter)
        this.updateActiveFilter(e.target)
      })
    })

    // Load more button
    const loadMoreBtn = document.getElementById("load-more-btn")
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        this.handleLoadMore()
      })
    }

    // Admin panel toggle
    const adminToggle = document.getElementById("admin-toggle")
    const adminPanel = document.getElementById("admin-panel")
    if (adminToggle && adminPanel) {
      adminToggle.addEventListener("click", () => {
        adminPanel.classList.toggle("open")
      })

      // Close admin panel when clicking outside
      document.addEventListener("click", (e) => {
        if (!adminPanel.contains(e.target)) {
          adminPanel.classList.remove("open")
        }
      })
    }
  }

  // Initialize search functionality
  initializeSearch() {
    // Set initial search state
    window.APP_STATE.searchQuery = ""
  }

  // Handle search
  handleSearch(query) {
    window.APP_STATE.searchQuery = query
    window.APP_STATE.currentPage = 1

    if (window.feedManager) {
      window.feedManager.loadPosts(true)
    }

    // Update search input if needed
    const searchInput = document.getElementById("search-input")
    if (searchInput && searchInput.value !== query) {
      searchInput.value = query
    }
  }

  // Handle sorting
  handleSort(sortBy) {
    window.APP_STATE.sortBy = sortBy
    window.APP_STATE.currentPage = 1

    if (window.feedManager) {
      window.feedManager.loadPosts(true)
    }
  }

  // Handle filtering
  handleFilter(filter) {
    window.APP_STATE.selectedCategory = filter
    window.APP_STATE.currentPage = 1

    if (window.feedManager) {
      window.feedManager.loadPosts(true)
    }
  }

  // Update active filter in sidebar
  updateActiveFilter(activeLink) {
    const sidebarLinks = document.querySelectorAll(".sidebar-menu a[data-filter]")
    sidebarLinks.forEach((link) => link.classList.remove("active"))
    activeLink.classList.add("active")
  }

  // Handle load more
  handleLoadMore() {
    window.APP_STATE.currentPage++

    if (window.feedManager) {
      window.feedManager.loadPosts(false)
    }
  }

  // Show/hide load more button
  toggleLoadMoreButton(show) {
    const loadMoreBtn = document.getElementById("load-more-btn")
    if (loadMoreBtn) {
      if (show) {
        loadMoreBtn.classList.remove("hidden")
      } else {
        loadMoreBtn.classList.add("hidden")
      }
    }
  }

  // Update load more button state
  updateLoadMoreButton(hasMore, isLoading = false) {
    const loadMoreBtn = document.getElementById("load-more-btn")
    if (loadMoreBtn) {
      loadMoreBtn.disabled = isLoading || !hasMore
      loadMoreBtn.textContent = isLoading ? "Loading..." : hasMore ? "Load More" : "No More Posts"

      if (!hasMore) {
        setTimeout(() => {
          this.toggleLoadMoreButton(false)
        }, 2000)
      }
    }
  }

  // Create post card HTML
  createPostCard(post) {
    const rating = post.average_rating || 0
    const ratingCount = post.rating_count || 0
    const isInCart = window.cartManager ? window.cartManager.isInCart(post.id) : false

    return `
            <div class="post-card" data-post-id="${post.id}">
                <img src="${post.image_url || "/diverse-products-still-life.png"}" 
                     alt="${post.title}" 
                     class="post-image"
                     onerror="this.src='/diverse-products-still-life.png'">
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-description">${post.description || "No description available"}</p>
                    <div class="post-meta">
                        <span class="post-price">${this.formatPrice(post.price || 0)}</span>
                        <div class="post-rating">
                            ${this.generateStars(rating)}
                            <span class="rating-text">(${ratingCount})</span>
                        </div>
                    </div>
                    <div class="post-actions">
                        <button class="btn-add-cart ${isInCart ? "disabled" : ""}" 
                                data-product-id="${post.id}"
                                ${isInCart ? "disabled" : ""}>
                            ${isInCart ? "In Cart" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        `
  }

  // Create category item HTML
  createCategoryItem(category) {
    return `
            <li>
                <a href="#" data-filter="${category.slug || category.id}">
                    ${category.name}
                </a>
            </li>
        `
  }

  // Create featured offer HTML
  createFeaturedOffer(offer) {
    return `
            <div class="offer-card">
                <div class="offer-title">${offer.title}</div>
                <div class="offer-description">${offer.description}</div>
            </div>
        `
  }

  // Show empty state
  showEmptyState(container, message = "No items found") {
    if (container) {
      container.innerHTML = `
                <div class="empty-state" style="
                    text-align: center;
                    padding: 3rem 1rem;
                    color: var(--color-text-muted);
                    grid-column: 1 / -1;
                ">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">${message}</p>
                    <p style="font-size: 0.9rem;">Try adjusting your search or filters</p>
                </div>
            `
    }
  }

  // Show error state
  showErrorState(container, message = "Something went wrong") {
    if (container) {
      container.innerHTML = `
                <div class="error-state" style="
                    text-align: center;
                    padding: 3rem 1rem;
                    color: var(--color-error);
                    grid-column: 1 / -1;
                ">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.7;"></i>
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">${message}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        Try Again
                    </button>
                </div>
            `
    }
  }

  // Debounce function
  debounce(func, wait) {
    let timeout
    return function (...args) {
      
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  // Format price function
  formatPrice(price) {
    return `$${price.toFixed(2)}`
  }

  // Generate stars function
  generateStars(rating) {
    let stars = ""
    for (let i = 0; i < Math.floor(rating); i++) {
      stars += '<i class="fas fa-star"></i>'
    }
    if (rating % 1 !== 0) {
      stars += '<i class="fas fa-star-half-alt"></i>'
    }
    for (let i = Math.floor(rating); i < 5; i++) {
      stars += '<i class="far fa-star"></i>'
    }
    return stars
  }
}

// Initialize UI manager
const uiManager = new UIManager()

// Define APP_STATE in the global scope
window.APP_STATE = {
  searchQuery: "",
  sortBy: "",
  selectedCategory: "",
  currentPage: 1,
}

// Define Utils in the global scope
window.Utils = {
  debounce: (func, wait) => {
    let timeout
    return function (...args) {
      
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  },
  formatPrice: (price) => `$${price.toFixed(2)}`,
  generateStars: (rating) => {
    let stars = ""
    for (let i = 0; i < Math.floor(rating); i++) {
      stars += '<i class="fas fa-star"></i>'
    }
    if (rating % 1 !== 0) {
      stars += '<i class="fas fa-star-half-alt"></i>'
    }
    for (let i = Math.floor(rating); i < 5; i++) {
      stars += '<i class="far fa-star"></i>'
    }
    return stars
  },
}
