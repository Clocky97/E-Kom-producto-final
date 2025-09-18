// Cart Manager for handling shopping cart functionality
class CartManager {
  constructor() {
    this.cartItems = []
    this.isOpen = false

    this.initialize()
  }

  // Initialize cart manager
  initialize() {
    this.loadCartFromStorage()
    this.bindEvents()
    this.updateCartUI()
  }

  // Bind cart-related events
  bindEvents() {
    // Cart button to open slider
    const cartBtn = document.getElementById("cart-btn")
    if (cartBtn) {
      cartBtn.addEventListener("click", () => this.toggleCart())
    }

    // Close cart button
    const closeCart = document.getElementById("close-cart")
    if (closeCart) {
      closeCart.addEventListener("click", () => this.closeCart())
    }

    // Cart overlay
    const cartOverlay = document.getElementById("cart-overlay")
    if (cartOverlay) {
      cartOverlay.addEventListener("click", () => this.closeCart())
    }

    // Cart items container (event delegation for remove buttons)
    const cartItems = document.getElementById("cart-items")
    if (cartItems) {
      cartItems.addEventListener("click", (e) => {
        if (e.target.classList.contains("cart-item-remove")) {
          const productId = Number.parseInt(e.target.dataset.productId)
          this.removeFromCart(productId)
        }
      })
    }

    // ESC key to close cart
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeCart()
      }
    })
  }

  // Add item to cart
  addToCart(product) {
    // Check if item already exists
    const existingItem = this.cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      window.Utils?.showToast("Item is already in cart", "info")
      return
    }

    // Add new item
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
      addedAt: new Date().toISOString(),
    }

    this.cartItems.push(cartItem)
    this.saveCartToStorage()
    this.updateCartUI()
    this.updateProductButtons(product.id, true)

    window.Utils?.showToast(`${product.title} added to cart`, "success")
  }

  // Remove item from cart
  removeFromCart(productId) {
    const itemIndex = this.cartItems.findIndex((item) => item.id === productId)

    if (itemIndex > -1) {
      const removedItem = this.cartItems[itemIndex]
      this.cartItems.splice(itemIndex, 1)
      this.saveCartToStorage()
      this.updateCartUI()
      this.updateProductButtons(productId, false)

      window.Utils?.showToast(`${removedItem.title} removed from cart`, "success")
    }
  }

  // Clear entire cart
  clearCart() {
    this.cartItems = []
    this.saveCartToStorage()
    this.updateCartUI()
    this.updateAllProductButtons()

    window.Utils?.showToast("Cart cleared", "success")
  }

  // Check if item is in cart
  isInCart(productId) {
    return this.cartItems.some((item) => item.id == productId)
  }

  // Get cart total
  getCartTotal() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Get cart item count
  getCartItemCount() {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  // Toggle cart slider
  toggleCart() {
    if (this.isOpen) {
      this.closeCart()
    } else {
      this.openCart()
    }
  }

  // Open cart slider
  openCart() {
    const cartSlider = document.getElementById("cart-slider")
    const cartOverlay = document.getElementById("cart-overlay")

    if (cartSlider && cartOverlay) {
      cartSlider.classList.add("open")
      cartOverlay.classList.add("active")
      document.body.style.overflow = "hidden"
      this.isOpen = true
    }
  }

  // Close cart slider
  closeCart() {
    const cartSlider = document.getElementById("cart-slider")
    const cartOverlay = document.getElementById("cart-overlay")

    if (cartSlider && cartOverlay) {
      cartSlider.classList.remove("open")
      cartOverlay.classList.remove("active")
      document.body.style.overflow = ""
      this.isOpen = false
    }
  }

  // Update cart UI
  updateCartUI() {
    this.updateCartCount()
    this.updateCartItems()
    this.updateCartTotal()
    this.updateCartEmpty()
  }

  // Update cart count badge
  updateCartCount() {
    const cartCount = document.getElementById("cart-count")
    if (cartCount) {
      const count = this.getCartItemCount()
      cartCount.textContent = count
      cartCount.style.display = count > 0 ? "flex" : "none"
    }
  }

  // Update cart items display
  updateCartItems() {
    const cartItemsContainer = document.getElementById("cart-items")
    if (!cartItemsContainer) return

    if (this.cartItems.length === 0) {
      cartItemsContainer.innerHTML = ""
      return
    }

    const itemsHTML = this.cartItems.map((item) => this.createCartItemHTML(item)).join("")
    cartItemsContainer.innerHTML = itemsHTML
  }

  // Update cart total
  updateCartTotal() {
    const cartTotal = document.getElementById("cart-total")
    if (cartTotal) {
      cartTotal.textContent = this.formatPrice(this.getCartTotal())
    }
  }

  // Update cart empty state
  updateCartEmpty() {
    const cartEmpty = document.querySelector(".cart-empty")
    if (cartEmpty) {
      if (this.cartItems.length === 0) {
        cartEmpty.classList.remove("hidden")
      } else {
        cartEmpty.classList.add("hidden")
      }
    }
  }

  // Create cart item HTML
  createCartItemHTML(item) {
    return `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image_url || "/placeholder.svg?height=60&width=60&text=Product"}" 
                     alt="${item.title}" 
                     class="cart-item-image"
                     onerror="this.src='/placeholder.svg?height=60&width=60&text=No+Image'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                </div>
                <button class="cart-item-remove" data-product-id="${item.id}" title="Remove from cart">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `
  }

  // Update product buttons based on cart state
  updateProductButtons(productId, isInCart) {
    const buttons = document.querySelectorAll(`[data-product-id="${productId}"]`)
    buttons.forEach((button) => {
      if (button.classList.contains("btn-add-cart")) {
        button.disabled = isInCart
        button.textContent = isInCart ? "In Cart" : "Add to Cart"
        if (isInCart) {
          button.classList.add("disabled")
        } else {
          button.classList.remove("disabled")
        }
      }
    })
  }

  // Update all product buttons
  updateAllProductButtons() {
    const buttons = document.querySelectorAll(".btn-add-cart")
    buttons.forEach((button) => {
      const productId = Number.parseInt(button.dataset.productId)
      const isInCart = this.isInCart(productId)
      button.disabled = isInCart
      button.textContent = isInCart ? "In Cart" : "Add to Cart"
      if (isInCart) {
        button.classList.add("disabled")
      } else {
        button.classList.remove("disabled")
      }
    })
  }

  // Save cart to localStorage
  saveCartToStorage() {
    try {
      localStorage.setItem("ekom_cart_items", JSON.stringify(this.cartItems))
    } catch (error) {
      console.error("Error saving cart to storage:", error)
    }
  }

  // Load cart from localStorage
  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem("ekom_cart_items")
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart)
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error)
      this.cartItems = []
    }
  }

  // Format price
  formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }
}

// Initialize cart manager
window.cartManager = new CartManager()
