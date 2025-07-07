import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import StarEx from "./starEx";
import { MdFavoriteBorder } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";



function Card({ id, name, price, img, star, rating }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Fetch cart and update isAdded
  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("api/cart", {
        method: "GET",
        credentials: "include",           // ← send guestId cookie
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) return;
      const cart = await res.json();
      const added =
        Array.isArray(cart.items) &&
        cart.items.some(
          (item) => item.product._id.toString() === id.toString()
        );
      setIsAdded(added);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("api/cart", {
        method: "POST",
        credentials: "include",           // ← include guestId or auth cookie
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Failed to add to cart");
      }
      // Immediately update UI
      setIsAdded(true);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert(err.message);
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked((v) => !v);
  };

  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className="product-card">
        <div className="image-wrapper">
          <img src={img} alt={name} className="item-image-prod" />
          <MdFavoriteBorder
            className={`favorite-icon ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          />
          <button
            className={`cart-button ${isAdded ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            {isAdded ? "✓ In Cart" : "Add To Cart"}
          </button>
        </div>
        <div className="description-section">
          <p className="product-title">{name}</p>
          <div className="price-info">
            <p className="price-label">{price} DA</p>
            <div className="rating-wrapper">
              <StarEx rating={star} />
              <span>({rating})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
