import { api } from "./api.js"

export class SidebarManager {
  constructor() {
    this.categories = []
    this.featuredOffers = []
    this.bindEvents()
    this.loadCategories()
    this.loadFeaturedOffers()
  }

  bindEvents() {
    // Quick access filters
    const quickFilters = document.querySelectorAll("[data-filter]")
    quickFilters.forEach((filter) => {
      filter.addEventListener("click", (e) => {
        e.preventDefault()
        this.handleFilter(filter.dataset.filter)
      })
    })
  }

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
        allowedCategories.includes(
          (cat.slug || cat.id || cat.name || "").toLowerCase().replace(/\s/g, "-")
        )
      )
      this.renderCategories()
    } catch (error) {
      this.renderFallbackCategories()
    }
  }

  renderCategories() {
    const categoriesList = document.getElementById("categories-list")
    if (!categoriesList) return

    categoriesList.innerHTML = this.categories
      .map(
        (category) => `
      <li>
        <a href="#" data-category="${category.slug || category.id}" 
           class="block px-3 py-2 text-gray-700 hover:bg-palette-100 rounded-md transition-colors">
          ${category.name}
        </a>
      </li>
    `,
      )
      .join("")

    // Bind category click events
    const categoryLinks = categoriesList.querySelectorAll("[data-category]")
    categoryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        this.handleCategoryFilter(link.dataset.category)
      })
    })
  }

  renderFallbackCategories() {
    const fallbackCategories = [
      { id: "vegano", name: "Vegano" },
      { id: "sin-tacc", name: "Sin TACC" },
      { id: "carnes", name: "Carnes" },
      { id: "lacteos", name: "Lácteos" },
      { id: "bebidas", name: "Bebidas" },
      { id: "panaderia", name: "Panadería" },
      { id: "frutas", name: "Frutas" },
      { id: "verduras", name: "Verduras" },
    ]

    const categoriesList = document.getElementById("categories-list")
    if (!categoriesList) return

    categoriesList.innerHTML = fallbackCategories
      .map(
        (category) => `
      <li>
        <a href="#" data-category="${category.id}" 
           class="block px-3 py-2 text-gray-700 hover:bg-palette-100 rounded-md transition-colors">
          ${category.name}
        </a>
      </li>
    `,
      )
      .join("")
  }

  async loadFeaturedOffers() {
    try {
      const products = await api.getProducts({ featured: true, limit: 3 })
      this.featuredOffers = products
      this.renderFeaturedOffers()
    } catch (error) {
      this.featuredOffers = []
      this.renderFeaturedOffers()
    }
  }

  renderFeaturedOffers() {
    const offersList = document.getElementById("featured-offers-list")
    if (!offersList) return

    if (!this.featuredOffers.length) {
      offersList.innerHTML = `<li class="text-gray-400 px-3 py-2">No hay ofertas destacadas</li>`
      return
    }

    offersList.innerHTML = this.featuredOffers
      .map(
        (offer) => `
      <li>
        <a href="#" class="flex items-center gap-2 px-3 py-2 hover:bg-palette-100 rounded-md transition-colors">
          <img src="${offer.image}" alt="${offer.name}" class="w-8 h-8 object-cover rounded" />
          <span class="font-medium">${offer.name}</span>
          <span class="ml-auto text-palette-600 font-semibold">${offer.price ? `$${offer.price}` : ""}</span>
        </a>
      </li>
    `,
      )
      .join("")
  }

  handleFilter(filterType) {
    const filterEvent = new CustomEvent("sidebarFilter", { detail: { filterType } })
    document.dispatchEvent(filterEvent)
  }

  handleCategoryFilter(categoryId) {
    const categoryEvent = new CustomEvent("sidebarCategory", { detail: { categoryId } })
    document.dispatchEvent(categoryEvent)
  }
}