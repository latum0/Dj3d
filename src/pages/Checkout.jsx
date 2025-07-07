// src/pages/Checkout.jsx
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Checkout.css"

const Checkout = () => {
  const navigate = useNavigate()
  const { user, guestId } = useAuth()

  // pull cart from backend so we can read any existing customName
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loadingCart, setLoadingCart] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phoneNumber: "",
    email: "",
    saveInfo: true,
    paymentMethod: "card",
  })
  const [customNames, setCustomNames] = useState({})
  const [selectedCard, setSelectedCard] = useState("visa")
  const [couponCode, setCouponCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // fetch the cart document on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
        const res = await fetch(
          "api/cart",
          {
            method: "GET",
            headers,
            credentials: "include",
          }
        )
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Erreur chargement panier")
        const items = data.cartItems || data.items || []
        setCartItems(items)
        setTotal(data.total ?? 0)
        // if the cart item already has a customName, prefill it
        const initialNames = {}
        items.forEach((item, idx) => {
          if (item.customName) {
            initialNames[idx] = item.customName
          }
        })
        setCustomNames(initialNames)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingCart(false)
      }
    }
    fetchCart()
  }, [])

  if (loadingCart) {
    return (
      <div className="checkout-page">
        <p>Chargement du panier…</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart-warning">
          <h2>Votre panier est vide</h2>
          <button onClick={() => navigate("/cart")}>Retour au panier</button>
        </div>
      </div>
    )
  }

  // do any item require a customName at all?
  const requiresCustom = cartItems.some(
    (item) => item.product?.category?.customNameAllowed
  )

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleCustomNameChange = (idx, value) => {
    setCustomNames((prev) => ({
      ...prev,
      [idx]: value,
    }))
  }

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }))
  }

  const handleCardSelection = (card) => {
    setSelectedCard(card)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // block if any required customName is still blank
    if (requiresCustom) {
      const missing = cartItems.filter(
        (item, idx) =>
          item.product?.category?.customNameAllowed &&
          !(customNames[idx]?.trim())
      )
      if (missing.length > 0) {
        alert(
          "Veuillez entrer un nom personnalisé pour chaque produit requis."
        )
        return
      }
    }

    setIsSubmitting(true)
    try {
      const orderItems = cartItems.map((item, index) => ({
        product: item.product?._id || item.productId || item._id,
        quantity: item.quantity,
        priceAtPurchase:
          item.product?.price ?? item.priceAtPurchase ?? 0,
        size: item.size,
        color: item.color,
        customName: item.product?.category?.customNameAllowed
          ? customNames[index].trim()
          : null,
      }))

      const payload = {
        items: orderItems,
        paymentMethod:
          formData.paymentMethod === "card"
            ? "CarteEdahabia"
            : "CashOnDelivery",
        shippingInfo: {
          city: formData.city,
          phone: formData.phoneNumber,
          email: user?.email || formData.email,
        },
        ...(!user && {
          guestDetails: {
            guestId,
            name: formData.name,
            email: formData.email,
            phone: formData.phoneNumber,
            address: { city: formData.city },
          },
        }),
      }

      const token = localStorage.getItem("token")
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Erreur inconnue")

      alert("Commande passée avec succès !")
      navigate("/")
    } catch (err) {
      console.error("Erreur complète:", err)
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-grid">
          <div className="order-form">
            <h1 className="page-title">Finaliser votre commande</h1>
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2 className="section-title">Informations de livraison</h2>
                {!user && (
                  <div className="form-group">
                    <label htmlFor="name">
                      Nom complet <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Entrez votre nom complet"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="city">
                    Ville / Localité <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Entrez votre ville"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    Numéro de téléphone <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                {!user && (
                  <div className="form-group">
                    <label htmlFor="email">
                      Adresse e-mail <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
                )}
              </div>

              {requiresCustom && (
                <div className="form-section">
                  <h2 className="section-title">
                    Personnalisation des produits
                  </h2>
                  <p className="section-description">
                    Ajoutez un nom personnalisé pour les produits qui le
                    nécessitent
                  </p>
                  {cartItems.map((item, index) => {
                    const allowed = item.product?.category?.customNameAllowed
                    if (!allowed) return null
                    // skip input if cart item already has customName
                    if (item.customName) return null
                    return (
                      <div key={index} className="custom-name-group">
                        <div className="product-info">
                          <span className="product-name">
                            {item.product?.name || "Produit"}
                          </span>
                          <span className="product-quantity">
                            Qté: {item.quantity}
                          </span>
                        </div>
                        <div className="form-group">
                          <label htmlFor={`customName-${index}`}>
                            Nom personnalisé <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            id={`customName-${index}`}
                            value={customNames[index] || ""}
                            onChange={e =>
                              handleCustomNameChange(index, e.target.value)
                            }
                            required
                            placeholder="Entrez un nom personnalisé"
                            maxLength="50"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* rest unchanged… */}
              <div className="form-section">
                <h2 className="section-title">Méthode de paiement</h2>
                <div className="payment-options">
                  <div className="payment-option">
                    <div className="payment-radio">
                      <input
                        type="radio"
                        id="card-payment"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={() =>
                          handlePaymentMethodChange("card")
                        }
                      />
                      <label htmlFor="card-payment">
                        <span className="payment-icon">💳</span>
                        Carte Edahabia
                      </label>
                    </div>

                  </div>
                  <div className="payment-option">
                    <div className="payment-radio">
                      <input
                        type="radio"
                        id="cash-payment"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={() =>
                          handlePaymentMethodChange("cash")
                        }
                      />
                      <label htmlFor="cash-payment">
                        <span className="payment-icon">💰</span>
                        Paiement à la livraison
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="place-order-btn"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🛒</span>
                    Confirmer la commande
                  </>
                )}
              </button>
            </form>
          </div>





          < div className="order-summary" >
            {/* …summary unchanged… */}
            < h2 className="summary-title" > Récapitulatif de commande</h2 >
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-info">
                    <span className="item-name">
                      {item.product?.name || "Produit"}
                    </span>
                    <span className="item-quantity">
                      Qté: {item.quantity}
                    </span>
                    {customNames[index] && (
                      <span className="item-custom-name">
                        Nom: {customNames[index]}
                      </span>
                    )}
                  </div>
                  <span className="item-price">
                    {(
                      (item.product?.price ||
                        item.priceAtPurchase ||
                        0) * item.quantity
                    ).toFixed(2)}{" "}
                    DA
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="coupon-section">
              <input
                type="text"
                placeholder="Code promo"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button type="button" className="apply-coupon">
                Appliquer
              </button>
            </div>

            <div className="summary-calculations">
              <div className="summary-item">
                <span>Sous-total:</span>
                <span className="summary-value">
                  {total.toFixed(2)} DA
                </span>
              </div>
              <div className="summary-item">
                <span>Livraison:</span>
                <span className="summary-value free">
                  Gratuite
                </span>
              </div>
              <div className="summary-item total">
                <span>Total:</span>
                <span className="summary-value">
                  {total.toFixed(2)} DA
                </span>
              </div>
            </div>

            <div className="security-badge">
              <span className="security-icon">🔒</span>
              <span>Paiement 100% sécurisé</span>
            </div>
          </div >
        </div >
      </div >
    </div >
  )
}

export default Checkout
