import { api } from "./api.js"

class FeedManager {
  constructor() {
    this.currentPosts = []
    this.categories = []
    this.featuredOffers = []
    this.hasMorePosts = true
    this.isLoading = false

    this.initialize()
  }

  // Initialize feed manager
  async initialize() {
    await this.loadCategories()
    await this.loadFeaturedOffers()
    await this.loadPosts(true)
    this.bindEvents()
  }

  // Bind feed-related events
  bindEvents() {
    // Add to cart buttons (event delegation)
    const postsFeed = document.getElementById("posts-feed")
    if (postsFeed) {
      postsFeed.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-add-cart") && !e.target.disabled) {
          const productId = e.target.dataset.productId
          if (productId && window.cartManager) {
            const post = this.currentPosts.find((p) => p.id == productId)
            if (post) {
              window.cartManager.addToCart(post)
            }
          }
        }
      })
    }

    // Category clicks (event delegation)
    const categoriesList = document.getElementById("categories-list")
    if (categoriesList) {
      categoriesList.addEventListener("click", (e) => {
        if (e.target.tagName === "A" && e.target.dataset.filter) {
          e.preventDefault()
          this.handleCategoryFilter(e.target.dataset.filter)
          this.updateActiveCategoryFilter(e.target)
        }
      })
    }
  }

  // Load posts from API
  async loadPosts(reset = false) {
    if (this.isLoading) return

    this.isLoading = true

    try {
      // Show loading state
      if (reset) {
        this.showLoadingState()
      }

      // Prepare API parameters
      const params = {
        page: window.APP_STATE.currentPage || 1,
        limit: window.API_CONFIG?.DEFAULT_PAGE_SIZE || 12,
        sort: window.APP_STATE.sortBy || "newest",
      }

      // Add search query if exists
      if (window.APP_STATE.searchQuery) {
        params.search = window.APP_STATE.searchQuery
      }

      // Add category filter if exists
      if (window.APP_STATE.selectedCategory && window.APP_STATE.selectedCategory !== "all") {
        params.category = window.APP_STATE.selectedCategory
      }

      // Real API call
      const response = await api.getProducts(params)
      const posts = Array.isArray(response) ? response : response.products || []

      if (reset) {
        this.currentPosts = posts
        this.renderPosts()
      } else {
        this.currentPosts = [...this.currentPosts, ...posts]
        this.appendPosts(posts)
      }

      this.hasMorePosts = posts.length === params.limit
      this.updateLoadMoreButton()
    } catch (error) {
      console.error("Error loading posts:", error)
      this.showErrorState("No se pudieron cargar los productos. Intenta de nuevo.")
      window.Utils?.showToast("No se pudieron cargar los productos", "error")
    } finally {
      this.isLoading = false
    }
  }

  // Load categories from API
  async loadCategories() {
    try {
      const categories = await api.getCategories()
      // Filtra solo las categorías relevantes de mercadería
      const allowedCategories = [
        "vegano",
        "sin-tacc",
        "carnes",
        "lacteos",
        "bebidas",
        "panaderia",
        "frutas",
        "verduras",
      ]
      this.categories = categories.filter(cat =>
        allowedCategories.includes(cat.slug || cat.id || cat.name.toLowerCase().replace(/\s/g, "-"))
      )
      this.renderCategories()
    } catch (error) {
      console.error("Error loading categories:", error)
      this.categories = []
      this.renderCategories()
    }
  }

  // Load featured offers from API
  async loadFeaturedOffers() {
    try {
      const offers = await api.getProducts({ featured: true, limit: 3 })
      this.featuredOffers = offers
      this.renderFeaturedOffers()
    } catch (error) {
      console.error("Error loading featured offers:", error)
      this.featuredOffers = []
      this.renderFeaturedOffers()
    }
  }

  // Render posts to the feed
  renderPosts() {
    const postsFeed = document.getElementById("posts-feed")
    if (!postsFeed) return

    if (this.currentPosts.length === 0) {
      this.showEmptyState()
      return
    }

    const postsHTML = this.currentPosts.map((post) => this.createPostCard(post)).join("")
    postsFeed.innerHTML = postsHTML
  }

  // Append new posts to the feed
  appendPosts(newPosts) {
    const postsFeed = document.getElementById("posts-feed")
    if (!postsFeed) return

    const postsHTML = newPosts.map((post) => this.createPostCard(post)).join("")
    postsFeed.insertAdjacentHTML("beforeend", postsHTML)
  }

  // Render categories to sidebar
  renderCategories() {
    const categoriesList = document.getElementById("categories-list")
    if (!categoriesList) return

    const categoriesHTML = this.categories
      .map((category) => `<li><a href="#" data-filter="${category.slug || category.id}">${category.name}</a></li>`)
      .join("")

    categoriesList.innerHTML = categoriesHTML
  }

  // Render featured offers to sidebar
  renderFeaturedOffers() {
    const featuredOffers = document.getElementById("featured-offers")
    if (!featuredOffers) return

    const offersHTML = this.featuredOffers
      .map(
        (offer) =>
          `<div class="offer-card">
                <div class="offer-title">${offer.name}</div>
                <div class="offer-description">${offer.description || ""}</div>
            </div>`,
      )
      .join("")

    featuredOffers.innerHTML = offersHTML
  }

  // Create post card HTML
  createPostCard(post) {
    const rating = post.average_rating || post.rating || 0
    const ratingCount = post.rating_count || post.ratingCount || 0
    const isInCart = window.cartManager ? window.cartManager.isInCart(post.id) : false

    // Etiquetas/tags relevantes
    const tags = Array.isArray(post.tags)
      ? post.tags.filter(tag =>
          ["vegano", "sin tacc", "carnes", "lacteos", "bebidas", "panaderia", "frutas", "verduras"].includes(tag.toLowerCase())
        )
      : []

    const tagsHtml = tags.length
      ? `<div class="post-tags mb-2">${tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")}</div>`
      : ""

    return `
      <div class="post-card" data-post-id="${post.id}">
        <img src="${post.image || post.image_url || "/placeholder.svg?height=200&width=320&text=Producto"}" 
             alt="${post.name}" 
             class="post-image"
             onerror="this.src='/placeholder.svg?height=200&width=320&text=No+Image'">
        <div class="post-content">
          <h3 class="post-title">${post.name}</h3>
          ${tagsHtml}
          <p class="post-description">${post.description || "Sin descripción"}</p>
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
              ${isInCart ? "En carrito" : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    `
  }

  // Handle category filter
  handleCategoryFilter(categorySlug) {
    window.APP_STATE.selectedCategory = categorySlug
    window.APP_STATE.currentPage = 1
    this.loadPosts(true)
  }

  // Update active category filter
  updateActiveCategoryFilter(activeLink) {
    const categoryLinks = document.querySelectorAll("#categories-list a")
    categoryLinks.forEach((link) => link.classList.remove("active"))
    activeLink.classList.add("active")
  }

  // Show loading state
  showLoadingState() {
    const postsFeed = document.getElementById("posts-feed")
    if (postsFeed) {
      postsFeed.innerHTML = `
        <div class="loading-state" style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem 1rem;
            color: var(--color-text-muted);
        ">
          <div class="loading-spinner" style="
              width: 40px;
              height: 40px;
              border: 4px solid var(--color-light);
              border-top: 4px solid var(--color-primary);
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto 1rem;
          "></div>
          <p>Cargando productos...</p>
        </div>
      `
    }
  }

  // Show empty state
  showEmptyState() {
    const postsFeed = document.getElementById("posts-feed")
    if (postsFeed) {
      postsFeed.innerHTML = `
        <div class="empty-state" style="
            text-align: center;
            padding: 3rem 1rem;
            color: var(--color-text-muted);
            grid-column: 1 / -1;
        ">
          <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No se encontraron productos</p>
          <p style="font-size: 0.9rem;">Prueba ajustando tu búsqueda o filtros</p>
        </div>
      `
    }
  }

  // Show error state
  showErrorState(message) {
    const postsFeed = document.getElementById("posts-feed")
    if (postsFeed) {
      postsFeed.innerHTML = `
        <div class="error-state" style="
            text-align: center;
            padding: 3rem 1rem;
            color: var(--color-error);
            grid-column: 1 / -1;
        ">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.7;"></i>
          <p style="font-size: 1.1rem; margin-bottom: 1rem;">${message}</p>
          <button class="btn btn-primary" onclick="window.feedManager.loadPosts(true)">
            Intentar de nuevo
          </button>
        </div>
      `
    }
  }

  // Update load more button
  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById("load-more-btn")
    if (loadMoreBtn) {
      loadMoreBtn.disabled = this.isLoading || !this.hasMorePosts
      loadMoreBtn.textContent = this.isLoading ? "Cargando..." : this.hasMorePosts ? "Cargar más" : "No hay más productos"

      if (!this.hasMorePosts) {
        setTimeout(() => {
          loadMoreBtn.style.display = "none"
        }, 2000)
      } else {
        loadMoreBtn.style.display = "block"
      }
    }
  }

  // Format price
  formatPrice(price) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price)
  }

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
  }
}

// Initialize feed manager
window.feedManager = new FeedManager()