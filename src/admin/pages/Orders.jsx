"use client"

import { useState, useEffect } from "react"
import "./Orders.css"
import axios from "axios"
import OrderDetailsModal from "../components/OrderDetailsModal"
import OrderAddingModal from "../components/OrderAddingModal"

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [openDropdown, setOpenDropdown] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showAddOrderModal, setShowAddOrderModal] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return window.location.replace("/login")

        const resp = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const list = Array.isArray(resp.data.data)
          ? resp.data.data
          : Array.isArray(resp.data)
            ? resp.data
            : resp.data.data
        setOrders(list)
      } catch (err) {
        console.error("API Error:", err.response || err)
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          return window.location.replace("/login")
        }
        setError(err.response?.data?.message || "Erreur lors de la récupération des commandes")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const toggleDropdown = (id) => setOpenDropdown((prev) => (prev === id ? null : id))

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
    setOpenDropdown(null)
  }

  const handleCancelOrder = (order) => {
    setSelectedOrder(order)
    setShowCancelModal(true)
    setOpenDropdown(null)
  }

  const confirmCancelOrder = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/api/orders/${selectedOrder._id}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setOrders((prev) => prev.map((o) => (o._id === selectedOrder._id ? { ...o, status: "Cancelled" } : o)))
    } catch (err) {
      console.error("API rejected cancel:", err.response || err)
      setError(err.response?.data?.message || "Erreur lors de l'annulation de la commande")
    } finally {
      setShowCancelModal(false)
    }
  }

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)))
    setSelectedOrder(updatedOrder)
  }

  const handleOrderAdd = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev])
  }

  const filtered = orders.filter((o) => {
    const term = searchTerm.toLowerCase()
    const name = o.user?.name || o.guestDetails?.name || ""
    const email = o.user?.email || o.guestDetails?.email || ""
    const matchSearch =
      o._id.toLowerCase().includes(term) || name.toLowerCase().includes(term) || email.toLowerCase().includes(term)
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    const matchPay = paymentFilter === "all" || o.paymentMethod === paymentFilter
    return matchSearch && matchStatus && matchPay
  })

  const getBadgeClass = (status) => {
    switch (status) {
      case "Delivered":
        return "orders-management-status-delivered"
      case "Shipped":
      case "Paid":
        return "orders-management-status-shipped"
      case "Processing":
        return "orders-management-status-processing"
      case "Pending":
        return "orders-management-status-pending"
      case "Cancelled":
        return "orders-management-status-cancelled"
      default:
        return ""
    }
  }

  const frDate = (d) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

  if (loading) {
    return (
      <div className="orders-management-loading-container">
        <div className="orders-management-loading-spinner"></div>
        <p>Chargement des commandes…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders-management-error-container">
        <div className="orders-management-error-icon">⚠️</div>
        <p>Erreur : {error}</p>
        <button onClick={() => window.location.reload()} className="orders-management-retry-btn">
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="orders-management-page">
      <div className="orders-management-page-header">
        <div className="orders-management-header-content">
          <div className="orders-management-header-left">
            <h1 className="orders-management-page-title">
              <span className="orders-management-title-icon">📦</span>
              Gestion des Commandes
            </h1>
            <p className="orders-management-page-subtitle">Gérez et suivez toutes vos commandes en temps réel</p>
          </div>
          <div className="orders-management-header-right">
            <div className="orders-management-header-stats">
              <div className="orders-management-stat-card">
                <div className="orders-management-stat-number">{orders.length}</div>
                <div className="orders-management-stat-label">Total</div>
              </div>
              <div className="orders-management-stat-card">
                <div className="orders-management-stat-number">
                  {orders.filter((o) => o.status === "Pending").length}
                </div>
                <div className="orders-management-stat-label">En attente</div>
              </div>
            </div>
            <button className="orders-management-add-btn" onClick={() => setShowAddOrderModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Nouvelle Commande
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="orders-management-alert orders-management-alert-error">
          <span className="orders-management-alert-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="orders-management-alert-close">
            ×
          </button>
        </div>
      )}

      <div className="orders-management-controls-section">
        <div className="orders-management-search-container">
          <div className="orders-management-search-input-wrapper">
            <input
              type="text"
              placeholder="Rechercher par ID, nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="orders-management-search-input"
            />
          </div>
        </div>

        <div className="orders-management-filters-container">
          <div className="orders-management-filter-group">
            <label className="orders-management-filter-label">Statut</label>
            <select
              className="orders-management-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="Pending">En attente</option>
              <option value="Paid">Payée</option>
              <option value="Shipped">Expédiée</option>
              <option value="Delivered">Livrée</option>
              <option value="Cancelled">Annulée</option>
            </select>
          </div>
          <div className="orders-management-filter-group">
            <label className="orders-management-filter-label">Paiement</label>
            <select
              className="orders-management-filter-select"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">Tous les paiements</option>
              <option value="PayPal">PayPal</option>
              <option value="CreditCard">Carte bancaire</option>
              <option value="CashOnDelivery">Espèces</option>
            </select>
          </div>
        </div>
      </div>

      <div className="orders-management-table-container">
        <div className="orders-management-table-wrapper">
          <table className="orders-management-modern-table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Paiement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((order, idx) => {
                  const isBottom = idx >= filtered.length - 2
                  return (
                    <tr key={order._id} className="orders-management-table-row">
                      <td>
                        <div className="orders-management-order-id">
                          <span className="orders-management-id-prefix">ORD-</span>
                          <span className="orders-management-id-number">{order._id.slice(0, 6).toUpperCase()}</span>
                        </div>
                      </td>
                      <td>
                        <div className="orders-management-client-info">
                          {order.user ? (
                            <>
                              <div className="orders-management-client-name">{order.user.name}</div>
                              <div className="orders-management-client-email">{order.user.email}</div>
                            </>
                          ) : (
                            <>
                              <div className="orders-management-client-name">
                                {order.guestDetails?.name || "Invité"}
                              </div>
                              <div className="orders-management-client-email">
                                {order.guestDetails?.email || "Non spécifié"}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="orders-management-date-info">
                          <span className="orders-management-date-main">{frDate(order.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="orders-management-amount-info">

                          <span className="orders-management-amount">{(order.totalAmount || 0).toFixed(2)} </span>
                          <span className="orders-management-currency">DA</span>
                        </div>
                      </td>
                      <td>
                        <span className={`orders-management-status-badge ${getBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="orders-management-payment-method">{order.paymentMethod}</div>
                      </td>
                      <td>
                        <div
                          className={`orders-management-action-dropdown${openDropdown === order._id ? " active" : ""}${isBottom ? " dropdown-up" : ""}`}
                        >
                          <button
                            className="orders-management-action-trigger"
                            onClick={() => toggleDropdown(order._id)}
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
                          <div className="orders-management-dropdown-menu">
                            <button
                              className="orders-management-dropdown-item"
                              onClick={() => handleViewDetails(order)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                              </svg>
                              Voir les détails
                            </button>
                            {order.status !== "Cancelled" && order.status !== "Delivered" && (
                              <button
                                className="orders-management-dropdown-item danger"
                                onClick={() => handleCancelOrder(order)}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M18 6L6 18M6 6L18 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                Annuler la commande
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="orders-management-no-data">
                    <div className="orders-management-no-data-content">
                      <div className="orders-management-no-data-icon">📭</div>
                      <p>Aucune commande trouvée</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Adding Modal */}
      <OrderAddingModal
        show={showAddOrderModal}
        onClose={() => setShowAddOrderModal(false)}
        onOrderAdd={(order) => setOrders([order, ...orders])}
        onError={(msg) => setError(msg)}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        show={showDetailsModal}
        order={selectedOrder}
        onClose={() => setShowDetailsModal(false)}
        onOrderUpdate={handleOrderUpdate}
        onError={setError}
        getBadgeClass={getBadgeClass}
        frDate={frDate}
      />

      {/* Cancel Modal */}
      {showCancelModal && selectedOrder && (
        <div className="orders-management-modal-overlay">
          <div className="orders-management-modal orders-management-modern-modal orders-management-cancel-modal">
            <div className="orders-management-modal-header">
              <h3 className="orders-management-modal-title">
                <span className="orders-management-modal-icon">⚠️</span>
                Annuler la commande
              </h3>
              <button className="orders-management-modal-close" onClick={() => setShowCancelModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="orders-management-modal-body">
              <div className="orders-management-cancel-content">
                <div className="orders-management-cancel-icon">🗑️</div>
                <p>
                  Êtes-vous sûr de vouloir annuler la commande{" "}
                  <strong>ORD-{selectedOrder._id.slice(0, 6).toUpperCase()}</strong> ?
                </p>
                <p className="orders-management-cancel-warning">Cette action est irréversible.</p>
              </div>
            </div>
            <div className="orders-management-modal-footer">
              <button
                className="orders-management-btn orders-management-btn-secondary"
                onClick={() => setShowCancelModal(false)}
              >
                Non, garder la commande
              </button>
              <button className="orders-management-btn orders-management-btn-danger" onClick={confirmCancelOrder}>
                Oui, annuler la commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
