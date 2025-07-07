// src/pages/Checkout.jsx
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Checkout.css"

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const RAW_API = import.meta.env.VITE_API_URL || "";
  const API_BASE = RAW_API.replace(/\/$/, "");

  // Fetch cart data from API (users & guests)
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/cart`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include", // send guestId cookie if present
        });
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        setCart(data ?? { items: [] });
      } catch (error) {
        console.error("Cart fetch error:", error);
        setCart({ items: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const applyPromoCode = () => {
    if (promoCode === "SAVE10") {
      setDiscount(10);
      setPromoApplied(true);
    } else {
      alert("Code promo invalide");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      const updated = await response.json();
      setCart(updated ?? { items: [] });
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error("Failed to remove item");
      const updated = await response.json();
      setCart(updated ?? { items: [] });
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir vider votre panier ?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/cart/clear"`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Échec lors du vidage du panier");
      setCart({ items: [] });
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  // Safe defaults
  const items = Array.isArray(cart.items) ? cart.items : [];
  const subTotal = items.reduce(
    (sum, item) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0),
    0
  );
  const tax = subTotal * 0.2;
  const shipping = subTotal > 500 ? 0 : 99.99;
  const total = subTotal + tax + shipping - discount;
  const formatPrice = (price) =>
    price.toFixed(2).replace(".", ",") + " DA";

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading-cart">
          <p>Chargement du panier...</p>
        </div>
      </div>
    );
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
