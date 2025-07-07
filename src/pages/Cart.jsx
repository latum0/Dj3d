import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import "./Cart.css";

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
    if (!window.confirm("êtes-vous sûr de vouloir vider votre panier ?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to clear cart");
      const updated = await response.json();
      setCart(updated ?? { items: [] });
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  const items = Array.isArray(cart.items) ? cart.items : [];
  const subTotal = items.reduce(
    (sum, item) =>
      sum +
      ((item?.product && typeof item.product.price === "number"
        ? item.product.price
        : 0) *
        (item?.quantity ?? 0)),
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
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Votre Panier</h1>
          {cart.items.length > 0 && (
            <span className="item-count">
              {cart.items.length} article{cart.items.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {cart.items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag size={64} />
            </div>
            <h2>Votre panier est vide</h2>
            <p>Vous n'avez pas encore ajouté d'articles à votre panier.</p>
            <button onClick={() => navigate("/")} className="continue-shopping">
              Commencer vos achats
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-items-header">
                <span className="product-header">Produit</span>
                <span className="quantity-header">Quantité</span>
                <span className="price-header">Prix</span>
              </div>

              {cart.items.map(
                (item) =>
                  item &&
                  item.product && (
                    <div className="cart-item" key={item.product._id}>
                      <div className="item-info">
                        <div className="item-image">
                          <img
                            src={item.product?.image?.[0] || "/placeholder.svg"}
                            alt={item.product?.name || "Produit"}
                          />
                        </div>
                        <div className="item-details">
                          <h3 className="item-name">{item.product?.name}</h3>
                          <button
                            className="remove-item"
                            onClick={() => removeItem(item.product._id)}
                          >
                            <Trash2 size={16} />
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <div className="item-quantity">
                        <button
                          className="quantity-btn decrease"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn increase"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="item-price">
                        <span className="price-value">
                          {formatPrice(
                            (typeof item.product.price === "number"
                              ? item.product.price
                              : 0) * (item.quantity ?? 0)
                          )}
                        </span>
                        <span className="unit-price">
                          {formatPrice(
                            typeof item.product.price === "number"
                              ? item.product.price
                              : 0
                          )}{" "}
                          / unité
                        </span>
                      </div>
                    </div>
                  )
              )}

              <div className="cart-actions">
                <button className="clear-cart" onClick={clearCart}>
                  <Trash2 size={16} />
                  Vider le panier
                </button>
                <button
                  className="continue-shopping"
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft size={16} />
                  Continuer vos achats
                </button>
              </div>
            </div>

            <div className="cart-summary">
              <h2>Récapitulatif</h2>
              <div className="promo-code">
                <input
                  type="text"
                  placeholder="Code promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <button
                  className="apply-promo"
                  onClick={applyPromoCode}
                  disabled={promoApplied || !promoCode}
                >
                  Appliquer
                </button>
              </div>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Sous-total</span>
                  <span>{formatPrice(subTotal)}</span>
                </div>
                <div className="summary-row">
                  <span>TVA (20%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="summary-row">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? "Gratuite" : formatPrice(shipping)}</span>
                </div>
                <div className="summary-row discount-row">
                  <span>Remise</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button
                className="checkout-button"
                onClick={() => navigate("/checkout")}
              >
                Passer à la caisse
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;