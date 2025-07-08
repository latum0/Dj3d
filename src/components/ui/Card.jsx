"use client"

// src/components/Card.jsx
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import "./Card.css"
import StarEx from "./starEx"
import { MdFavoriteBorder } from "react-icons/md"
import { useAuth } from "../../context/AuthContext"

function Card({ id, name, price, img, star, rating }) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  // Grab API URL from env and strip trailing slash
  const RAW_API = import.meta.env.VITE_API_URL || ""
  const API_BASE = RAW_API.replace(/\/$/, "")

  // Fetch cart items to determine if this product is already added
  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/cart`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      if (!res.ok) return
      const cart = await res.json()
      const added = Array.isArray(cart.items) && cart.items.some((item) => item.product._id.toString() === id)
      setIsAdded(added)
    } catch (err) {
      console.error("Error fetching cart:", err)
    }
  }, [API_BASE, id])

  useEffect(() => {
    fetchCart()
  }, [fetchCart, user])

  // Handle "Add to Cart" click
  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error || errBody.message || "Failed to add to cart")
      }
      setIsAdded(true)
    } catch (err) {
      console.error("Add to cart error:", err)
      alert(err.message)
    }
  }

  const handleLike = (e) => {
    e.preventDefault()
    setIsLiked((v) => !v)
  }

  return (
    <Link to={`/product/${id}`} className="card-link">
      <div className="card">
        <div className="card__media">
          <img src={img || "/placeholder.svg"} alt={name} className="card__image" />
          <MdFavoriteBorder
            className={`card__favorite ${isLiked ? "card__favorite--liked" : ""}`}
            onClick={handleLike}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          />
          <button
            className={`card__cart-btn ${isAdded ? "card__cart-btn--added" : ""}`}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            {isAdded ? "✓ In Cart" : "Add To Cart"}
          </button>
        </div>
        <div className="card__content">
          <h3 className="card__title">{name}</h3>
          <div className="card__footer">
            <span className="card__price">{price} DA</span>
            <div className="card__rating">
              <StarEx rating={star} />
              <span className="card__rating-count">({rating})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
