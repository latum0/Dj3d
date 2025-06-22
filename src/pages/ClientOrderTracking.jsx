"use client"

import { useState } from "react"
import "./ClientOrderTracking.css"

const ClientOrderTracking = () => {
  const [selectedTab, setSelectedTab] = useState("all")
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [reviewProduct, setReviewProduct] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Données d'exemple pour les commandes du client
  const orders = [
    {
      id: "ORD-2023-1234",
      date: "01/05/2024",
      total: "1299,99 €",
      status: "delivered",
      customerInfo: {
        name: "Sophie Martin",
        phone: "06 12 34 56 78",
        email: "sophie.martin@example.com",
        address: "123 Rue de Paris, 75001 Paris, France",
      },
      payment: "Carte bancaire",
      items: [
        {
          id: "PROD-001",
          name: "Boîtier PC Corsair 4000D",
          price: "99,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
        {
          id: "PROD-002",
          name: "Carte graphique RTX 4070",
          price: "899,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: true,
        },
        {
          id: "PROD-003",
          name: "Mémoire RAM Corsair 32GB",
          price: "149,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
      ],
    },
    {
      id: "ORD-2023-1235",
      date: "30/04/2024",
      total: "2499,99 €",
      status: "shipped",
      customerInfo: {
        name: "Sophie Martin",
        phone: "06 12 34 56 78",
        email: "sophie.martin@example.com",
        address: "123 Rue de Paris, 75001 Paris, France",
      },
      payment: "PayPal",
      items: [
        {
          id: "PROD-004",
          name: "Razer Blade 15",
          price: "2499,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
      ],
    },
    {
      id: "ORD-2023-1236",
      date: "29/04/2024",
      total: "349,97 €",
      status: "processing",
      customerInfo: {
        name: "Sophie Martin",
        phone: "06 12 34 56 78",
        email: "sophie.martin@example.com",
        address: "123 Rue de Paris, 75001 Paris, France",
      },
      payment: "Carte bancaire",
      items: [
        {
          id: "PROD-005",
          name: "Clavier Razer BlackWidow",
          price: "149,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
        {
          id: "PROD-006",
          name: "Souris Razer DeathAdder",
          price: "69,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
        {
          id: "PROD-007",
          name: "Casque Razer Kraken",
          price: "99,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
      ],
    },
    {
      id: "ORD-2023-1237",
      date: "28/04/2024",
      total: "799,99 €",
      status: "cancelled",
      customerInfo: {
        name: "Sophie Martin",
        phone: "06 12 34 56 78",
        email: "sophie.martin@example.com",
        address: "123 Rue de Paris, 75001 Paris, France",
      },
      payment: "Carte bancaire",
      items: [
        {
          id: "PROD-008",
          name: "Processeur Intel i9-13900K",
          price: "599,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
        {
          id: "PROD-009",
          name: "Ventirad Noctua NH-D15",
          price: "99,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
      ],
    },
    {
      id: "ORD-2023-1238",
      date: "27/04/2024",
      total: "1899,97 €",
      status: "ordered",
      customerInfo: {
        name: "Sophie Martin",
        phone: "06 12 34 56 78",
        email: "sophie.martin@example.com",
        address: "123 Rue de Paris, 75001 Paris, France",
      },
      payment: "Virement bancaire",
      items: [
        {
          id: "PROD-010",
          name: "Carte mère ASUS ROG Z790",
          price: "399,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
        {
          id: "PROD-011",
          name: "Processeur Intel i7-13700K",
          price: "449,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
        {
          id: "PROD-012",
          name: "Carte graphique RTX 4060 Ti",
          price: "499,99 €",
          quantity: 1,
          image: "https://placehold.co/80x80",
          reviewed: false,
        },
      ],
    },
  ]

  // Filtrer les commandes en fonction de l'onglet sélectionné
  const filteredOrders = selectedTab === "all" ? orders : orders.filter((order) => order.status === selectedTab)

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
    } else {
      setExpandedOrderId(orderId)
    }
  }

  // Fonction pour ouvrir le dialogue de commentaire
  const openReviewDialog = (product, order) => {
    setReviewProduct(product)
    setSelectedOrder(order)
    setReviewText("")
    setRating(0)
    setReviewDialogOpen(true)
  }

  // Fonction pour soumettre un commentaire
  const submitReview = () => {
    console.log(`Commentaire pour ${reviewProduct?.name}: ${reviewText}, Note: ${rating}/5`)
    setReviewDialogOpen(false)
  }

  // Render status badge
  const renderStatus = (status) => {
    switch (status) {
      case "delivered":
        return (
          <span className="status-badge status-delivered">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Livrée
          </span>
        )
      case "processing":
        return (
          <span className="status-badge status-processing">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            En préparation
          </span>
        )
      case "shipped":
        return (
          <span className="status-badge status-shipped">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            En transit
          </span>
        )
      case "ordered":
        return (
          <span className="status-badge status-ordered">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            Commandée
          </span>
        )
      case "cancelled":
        return (
          <span className="status-badge status-cancelled">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Annulée
          </span>
        )
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  return (
    <div className="orders-container">
      <div className="orders-content">
        <div className="orders-header">
          <h1>Mes Commandes</h1>
        </div>

        {/* Status tabs */}
        <div className="status-tabs">
          <button
            className={`tab-button ${selectedTab === "all" ? "active" : ""}`}
            onClick={() => setSelectedTab("all")}
          >
            Toutes
          </button>
          <button
            className={`tab-button ${selectedTab === "ordered" ? "active" : ""}`}
            onClick={() => setSelectedTab("ordered")}
          >
            Commandées
          </button>
          <button
            className={`tab-button ${selectedTab === "processing" ? "active" : ""}`}
            onClick={() => setSelectedTab("processing")}
          >
            En préparation
          </button>
          <button
            className={`tab-button ${selectedTab === "shipped" ? "active" : ""}`}
            onClick={() => setSelectedTab("shipped")}
          >
            En transit
          </button>
          <button
            className={`tab-button ${selectedTab === "delivered" ? "active" : ""}`}
            onClick={() => setSelectedTab("delivered")}
          >
            Livrées
          </button>
          <button
            className={`tab-button ${selectedTab === "cancelled" ? "active" : ""}`}
            onClick={() => setSelectedTab("cancelled")}
          >
            Annulées
          </button>
        </div>

        {/* Orders list */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <p className="empty-title">Aucune commande trouvée</p>
              <p className="empty-subtitle">Vous n'avez pas encore de commandes dans cette catégorie</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Order header */}
                <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                  <div className="order-info">
                    <div className="order-title">
                      <h3>Commande #{order.id}</h3>
                      {renderStatus(order.status)}
                    </div>
                    <p className="order-date">Passée le {order.date}</p>
                  </div>
                  <div className="order-actions">
                    <p className="order-total">{order.total}</p>
                    <button className="toggle-button">
                      {expandedOrderId === order.id ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded order details */}
                {expandedOrderId === order.id && (
                  <div className="order-details">
                    {/* Customer info */}
                    <div className="customer-info">
                      <h4>Informations client</h4>
                      <div className="info-grid">
                        <p>
                          <span className="info-label">Nom:</span> {order.customerInfo.name}
                        </p>
                        <p>
                          <span className="info-label">Téléphone:</span> {order.customerInfo.phone}
                        </p>
                        <p>
                          <span className="info-label">Email:</span> {order.customerInfo.email}
                        </p>
                        <p>
                          <span className="info-label">Adresse:</span> {order.customerInfo.address}
                        </p>
                        <p>
                          <span className="info-label">Paiement:</span> {order.payment}
                        </p>
                      </div>
                    </div>

                    {/* Product list */}
                    <div className="products-section">
                      <h4>Produits</h4>
                      <div className="products-list">
                        {order.items.map((item, index) => (
                          <div key={index} className="product-item">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="product-image"
                            />
                            <div className="product-details">
                              <p className="product-name">{item.name}</p>
                              <p className="product-quantity">Qté: {item.quantity}</p>
                            </div>
                            <div className="product-actions">
                              <p className="product-price">{item.price}</p>
                              {order.status === "delivered" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openReviewDialog(item, order)
                                  }}
                                  className="review-button"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
                                  {item.reviewed ? "Modifiez avis" : "Ajouter avis"}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal pour laisser un commentaire */}
      {reviewDialogOpen && (
        <div className="modal-overlay" onClick={() => setReviewDialogOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Évaluer votre produit</h2>
              <p>Partagez votre expérience avec {reviewProduct?.name}</p>
            </div>
            <div className="modal-body">
              <div className="rating-container">
                <h3>Note</h3>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={star <= rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={star <= rating ? "star-filled" : "star-empty"}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="review-text-container">
                <textarea
                  placeholder="Partagez votre avis sur ce produit..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="review-textarea"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setReviewDialogOpen(false)}>
                Annuler
              </button>
              <button
                className="submit-button"
                onClick={submitReview}
                disabled={rating === 0 || !reviewText.trim()}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientOrderTracking
