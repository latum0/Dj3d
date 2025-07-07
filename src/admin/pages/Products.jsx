"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Products.css"
import ProductFormModal from "../components/ProductFormModal"
import ProductDetailsModal from "../components/ProductDetailsModal"

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [viewMode, setViewMode] = useState("card")
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(res.data.data || res.data)
    } catch (err) {
      console.error(err)
      setError("Erreur lors du chargement des produits")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCategories(res.data.data || res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowFormModal(true)
    setOpenDropdown(null)
  }

  const handleViewDetails = (product) => {
    setSelectedProduct(product)
    setShowDetailsModal(true)
    setOpenDropdown(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await fetchProducts()
      setOpenDropdown(null)
    } catch (err) {
      console.error(err)
      setError("Erreur lors de la suppression")
    }
  }

  const handleProductSave = () => {
    fetchProducts()
    setShowFormModal(false)
    setEditingProduct(null)
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowFormModal(true)
  }

  const filteredProducts = products.filter((p) => {
    const search = searchTerm.toLowerCase()
    const matchesSearch = p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)

    const matchesCategory =
      categoryFilter === "all" ||
      (typeof p.category === "object" ? p.category._id === categoryFilter : p.category === categoryFilter)

    return matchesSearch && matchesCategory
  })

  const getCategoryName = (category) => {
    if (typeof category === "object" && category?.name) return category.name
    return categories.find((c) => c._id === category)?.name || "—"
  }

  if (loading && products.length === 0) return <p>Chargement...</p>

  return (
    <div className="products-management-page">
      <div className="products-management-page-header">
        <div className="products-management-header-content">
          <div className="products-management-header-left">
            <h1 className="products-management-page-title">
              <span className="products-management-title-icon">🛍️</span>
              Gestion des Produits
            </h1>
            <p className="products-management-page-subtitle">
              Gérez votre catalogue de produits et organisez vos inventaires
            </p>
          </div>
          <button
            className="products-management-btn products-management-btn-primary"
            onClick={handleAddProduct}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Ajouter un produit
          </button>
        </div>
      </div>

      {error && (
        <div className="products-management-alert products-management-alert-error">
          <span className="products-management-alert-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="products-management-alert-close">
            ×
          </button>
        </div>
      )}

      <div className="products-management-controls-section">
        <div className="products-management-search-container">
          <div className="products-management-search-input-wrapper">
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="products-management-search-input"
            />
          </div>
        </div>

        <div className="products-management-filters-container">
          <div className="products-management-filter-group">
            <label className="products-management-filter-label">Catégorie</label>
            <select
              className="products-management-filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="products-management-view-toggle">
            <label className="products-management-filter-label">Affichage</label>
            <div className="products-management-toggle-buttons">
              <button
                className={`products-management-toggle-btn ${viewMode === "card" ? "active" : ""}`}
                onClick={() => setViewMode("card")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                </svg>
                Cartes
              </button>
              <button
                className={`products-management-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
                  <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
                  <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" />
                  <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" />
                  <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" />
                  <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" />
                </svg>
                Liste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card View */}
      {viewMode === "card" && (
        <div className="products-management-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="products-management-card">
              <div className="products-management-card-image" onClick={() => handleViewDetails(product)}>
                <img
                  src={product.image || "/placeholder.svg?height=200&width=200"}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=200&width=200"
                  }}
                />
                <div className="products-management-card-actions">
                  <div
                    className={`products-management-action-dropdown${openDropdown === product._id ? " active" : ""}`}
                  >
                    <button
                      className="products-management-action-trigger"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenDropdown(openDropdown === product._id ? null : product._id)
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                          fill="currentColor"
                        />
                        <path
                          d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                          fill="currentColor"
                        />
                        <path
                          d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <div className="products-management-dropdown-menu">
                      <button className="products-management-dropdown-item" onClick={() => handleViewDetails(product)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Voir détails
                      </button>


                    </div>
                  </div>
                </div>
              </div>
              <div className="products-management-card-info">
                <h3 className="products-management-card-name">{product.name}</h3>
                <p className="products-management-card-description">{product.description}</p>
                <div className="products-management-card-meta">
                  <span className="products-management-card-price">{product.price?.toFixed(2)}DA</span>
                  <span className="products-management-card-category">{getCategoryName(product.category)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="products-management-list-container">
          <div className="products-management-list-wrapper">
            <table className="products-management-list-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Produit</th>
                  <th>Description</th>
                  <th>Prix</th>
                  <th>Catégorie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="products-management-list-row">
                    <td>
                      <div className="products-management-list-image" onClick={() => handleViewDetails(product)}>
                        <img
                          src={product.image || "/placeholder.svg?height=60&width=60"}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=60&width=60"
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="products-management-list-name">{product.name}</div>
                    </td>
                    <td>
                      <div className="products-management-list-description">{product.description}</div>
                    </td>
                    <td>
                      <div className="products-management-list-price">{product.price?.toFixed(2)}DA</div>
                    </td>
                    <td>
                      <span className="products-management-list-category">{getCategoryName(product.category)}</span>
                    </td>
                    <td>
                      <div
                        className={`products-management-action-dropdown${openDropdown === product._id ? " active" : ""}`}
                      >
                        <button
                          className="products-management-action-trigger"
                          onClick={() => setOpenDropdown(openDropdown === product._id ? null : product._id)}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                              fill="currentColor"
                            />
                            <path
                              d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                              fill="currentColor"
                            />
                            <path
                              d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                        <div className="products-management-dropdown-menu">
                          <button
                            className="products-management-dropdown-item"
                            onClick={() => handleViewDetails(product)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Voir détails
                          </button>
                          <button className="products-management-dropdown-item" onClick={() => handleEdit(product)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                            Modifier
                          </button>
                          <button
                            className="products-management-dropdown-item danger"
                            onClick={() => handleDelete(product._id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="products-management-no-data">
          <div className="products-management-no-data-content">
            <div className="products-management-no-data-icon">📦</div>
            <p>Aucun produit trouvé</p>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        show={showFormModal}
        product={editingProduct}
        categories={categories}
        onClose={() => {
          setShowFormModal(false)
          setEditingProduct(null)
        }}
        onSave={handleProductSave}
        onError={setError}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        show={showDetailsModal}
        product={selectedProduct}
        categories={categories}
        onClose={() => setShowDetailsModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getCategoryName={getCategoryName}
      />
    </div>
  )
}

export default Products