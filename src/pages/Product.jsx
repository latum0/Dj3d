"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "./Product.css"
import {
  MdFavoriteBorder,
  MdFavorite,
  MdOutlineShoppingCart,
  MdLocalShipping,
  MdSecurity,
  MdLoop,
} from "react-icons/md"
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPinterestP,
  FaWhatsapp,
  FaCheck,
  FaMinus,
  FaPlus,
} from "react-icons/fa"
import Diviser from "../components/ui/Diviser"
import Card from "../components/ui/Card"
import { useAuth } from "../context/AuthContext"

const Product = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const RAW_API = import.meta.env.VITE_API_URL || "";
  const API_BASE = RAW_API.replace(/\/$/, "");

  // core states
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeTab, setActiveTab] = useState("description")
  const [currentImage, setCurrentImage] = useState(0)
  const [isAdded, setIsAdded] = useState(false)

  // variation states
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [customName, setCustomName] = useState("")

  const availableSizes = ["S", "M", "L"]
  const availableColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Blue", value: "#007BFF" },
    { name: "Red", value: "#DC3545" },
    { name: "Green", value: "#28A745" },
    { name: "Gray", value: "#6C757D" },
  ]

  const customNameCategory = product?.category?.customNameAllowed || false

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`)
        if (!res.ok) throw new Error("Product not found")
        const { data } = await res.json()
        setProduct(data)
        if (availableSizes.length) setSelectedSize(availableSizes[0])
        if (availableColors.length) setSelectedColor(availableColors[0].name)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    const checkCartStatus = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("${API_BASE}/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        })
        if (!res.ok) return
        const cart = await res.json()
        const inCart = cart.items.some(
          (item) =>
            item.product._id === id &&
            item.size === selectedSize &&
            item.color === selectedColor &&
            (customNameCategory ? item.customName === customName.trim() : true)
        )
        setIsAdded(inCart)
      } catch (err) {
        console.error("Cart status fetch failed:", err)
      }
    }

    if (selectedSize && selectedColor && (!customNameCategory || customName.trim())) {
      checkCartStatus()
    }
  }, [id, user, selectedSize, selectedColor, customName])

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }
    if (!selectedColor) {
      alert("Please select a color")
      return
    }
    if (customNameCategory && !customName.trim()) {
      alert("Please enter your name")
      return
    }

    const payload = {
      productId: id,
      quantity,
      size: selectedSize,
      color: selectedColor,
      ...(customNameCategory && { customName: customName.trim() }),
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to add to cart")
      setIsAdded(true)
      alert(`${quantity} item(s) added to cart!`)
    } catch (err) {
      console.error("Add to cart error:", err)
      alert(err.message)
    }
  }

  const generateImages = (imgs) =>
    Array.isArray(imgs) && imgs.length ? imgs : [imgs || "/placeholder.svg"]

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading product details...</p>
      </div>
    )
  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    )
  if (!product) return <div className="not-found">Product not found</div>

  const productImages = generateImages(product.image)
  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0
  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="product-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/category/components">Core Components</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={`/category/${product.category._id}`}>{product.category.name}</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-main">
        {/* Image Gallery */}
        <div className="image-gallery-section">
          {discountPercentage > 0 && (
            <div className="discount-badge">-{discountPercentage}%</div>
          )}
          <div className="main-image-container">
            <img
              src={productImages[currentImage]}
              alt={product.name}
              className="main-product-image"
            />
            <div className="image-zoom-hint">
              <span className="zoom-icon">🔍</span>
              <span>Hover to zoom</span>
            </div>
          </div>
          <div className="thumbnail-gallery">
            {productImages.map((img, idx) => (
              <div
                key={idx}
                className={`thumbnail-item ${currentImage === idx ? "active" : ""
                  }`}
                onClick={() => setCurrentImage(idx)}
              >
                <img src={img} alt={`${product.name} view ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <div className="product-brand">{product.brand || "ASUS"}</div>
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= 4 ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-count">(24 reviews)</span>
          </div>

          <div className="price-section">
            {product.salePrice ? (
              <>
                <span className="original-price">
                  {product.price.toFixed(2)} DA
                </span>
                <span className="current-price">
                  {product.salePrice.toFixed(2)} DA
                </span>
                <span className="discount-tag">
                  Save {discountPercentage}%
                </span>
              </>
            ) : (
              <span className="current-price">
                {product.price.toFixed(2)} DA
              </span>
            )}
          </div>



          {/* Variations */}
          <div className="product-variations">
            {/* Size */}
            <div className="variation-group">
              <label className="variation-label">
                Size <span className="required">*</span>
              </label>
              <div className="size-options">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? "selected" : ""
                      }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="variation-group">
              <label className="variation-label">
                Color <span className="required">*</span>
              </label>
              <div className="color-options">
                {availableColors.map((c) => (
                  <button
                    key={c.name}
                    className={`color-option ${selectedColor === c.name ? "selected" : ""
                      }`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <FaCheck className="color-check" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Name */}
            {customNameCategory && (
              <div className="variation-group">
                <label className="variation-label" htmlFor="customName">
                  Your Name <span className="required">*</span>
                </label>
                <input
                  id="customName"
                  type="text"
                  className="custom-name-input"
                  placeholder="Enter your name for customization"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  maxLength={50}
                />
                <span className="input-helper">
                  This will be printed/engraved on your product
                </span>
              </div>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="product-actions">
            <div className="quantity-selector">
              <button
                className="quantity-btn"
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                disabled={quantity <= 1}
              >
                <FaMinus />
              </button>
              <input
                type="text"
                readOnly
                className="quantity-input"
                value={quantity}
              />
              <button
                className="quantity-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <FaPlus />
              </button>
            </div>

            <div className="action-buttons">
              <button
                className={`add-to-cart-btn ${isAdded ? "added" : ""
                  }`}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {isAdded ? (
                  <>
                    <FaCheck className="btn-icon" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <MdOutlineShoppingCart className="btn-icon" />
                    <span>Add To Cart</span>
                  </>
                )}
              </button>
              <button
                className="buy-now-btn"
                onClick={() => alert("Proceed to buy")}
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Wishlist */}
          <button
            className={`wishlist-btn ${isLiked ? "active" : ""}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            {isLiked ? (
              <MdFavorite className="heart-icon" />
            ) : (
              <MdFavoriteBorder className="heart-icon" />
            )}
            <span>
              {isLiked ? "Added to Wishlist" : "Add to Wishlist"}
            </span>
          </button>

          {/* Benefits */}
          <div className="product-benefits">
            <div className="benefit-item">
              <MdLocalShipping className="benefit-icon" />
              <div className="benefit-text">
                <h4>Free Shipping</h4>
                <p>On orders over 10,000 DA</p>
              </div>
            </div>
            <div className="benefit-item">
              <MdLoop className="benefit-icon" />
              <div className="benefit-text">
                <h4>Easy Returns</h4>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className="benefit-item">
              <MdSecurity className="benefit-icon" />
              <div className="benefit-text">
                <h4>Secure Checkout</h4>
                <p>100% Protected Payments</p>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">SKU:</span>
              <span className="meta-value">
                {product._id.substring(0, 5)}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">
                {product.category.name}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Brand:</span>
              <span className="meta-value">
                {product.brand || "ASUS"}
              </span>
            </div>
          </div>

          {/* Social Share */}
          <div className="social-share">
            <span className="share-label">Share:</span>
            <div className="share-icons">
              <a href="#" className="share-icon facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="share-icon twitter">
                <FaTwitter />
              </a>
              <a href="#" className="share-icon linkedin">
                <FaLinkedinIn />
              </a>
              <a href="#" className="share-icon pinterest">
                <FaPinterestP />
              </a>
              <a href="#" className="share-icon whatsapp">
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
      <div className="product-details-tabs">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "description" ? "active" : ""
              }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab-btn ${activeTab === "specifications" ? "active" : ""
              }`}
            onClick={() => setActiveTab("specifications")}
          >
            Specifications
          </button>
          <button
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews (24)
          </button>
        </div>
        <div className="tabs-content">
          {/* ... your tab panes remain unchanged ... */}
          {activeTab === "description" && (
            <div className="tab-pane">
              <p>{product.description}</p>
              <p>
                The ASUS TUF GAMING X670E-PLUS WIFI motherboard delivers rock-solid performance with a robust power
                solution, comprehensive cooling, and extensive connectivity options. Built with military-grade
                components, this motherboard is designed for durability and reliability.
              </p>
              <p>
                Featuring PCIe 5.0, DDR5 memory support, and WiFi 6E connectivity, the TUF GAMING X670E-PLUS WIFI
                provides cutting-edge performance for AMD Ryzen 7000 series processors.
              </p>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="tab-pane">
              <div className="specs-grid">
                <div className="spec-group">
                  <h3>CPU</h3>
                  <p>AMD AM5 Socket for AMD Ryzen 7000 Series Desktop Processors</p>
                </div>
                <div className="spec-group">
                  <h3>Chipset</h3>
                  <p>AMD X670E Chipset</p>
                </div>
                <div className="spec-group">
                  <h3>Memory</h3>
                  <p>
                    4 x DIMM, Max. 128GB, DDR5 6400+(OC)/6200(OC)/6000(OC)/5800(OC)/5600/5400/5200/5000/4800 Non-ECC,
                    Un-buffered Memory
                  </p>
                </div>
                <div className="spec-group">
                  <h3>Expansion Slots</h3>
                  <p>
                    1 x PCIe 5.0 x16 slot
                    <br />1 x PCIe 4.0 x16 slot (x4 mode)
                    <br />1 x PCIe 3.0 x1 slot
                  </p>
                </div>
                <div className="spec-group">
                  <h3>Storage</h3>
                  <p>
                    4 x M.2 slots (PCIe 4.0 x4)
                    <br />4 x SATA 6Gb/s ports
                  </p>
                </div>
                <div className="spec-group">
                  <h3>Networking</h3>
                  <p>
                    1 x 2.5Gb Ethernet
                    <br />
                    WiFi 6E (802.11a/b/g/n/ac/ax)
                    <br />
                    Bluetooth 5.2
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="tab-pane">
              <div className="reviews-summary">
                <div className="rating-summary">
                  <div className="average-rating">4.0</div>
                  <div className="stars-summary">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`star ${star <= 4 ? "filled" : ""}`}>
                        ★
                      </span>
                    ))}
                    <span className="total-reviews">Based on 24 reviews</span>
                  </div>
                </div>
                <button className="write-review-btn">Write a Review</button>
              </div>

              <div className="reviews-list">
                {[
                  {
                    name: "Ahmed K.",
                    date: "May 2, 2025",
                    rating: 5,
                    title: "Excellent motherboard for my Ryzen 9 build",
                    content:
                      "I've been using this motherboard for about a month now with a Ryzen 9 7900X and it's been rock solid. The BIOS is easy to navigate, and the board has all the features I need.",
                  },
                  {
                    name: "Sarah L.",
                    date: "April 15, 2025",
                    rating: 4,
                    title: "Good value for an X670E board",
                    content:
                      "This is a solid motherboard with good features for the price. The only reason I'm giving it 4 stars instead of 5 is because the M.2 heatsinks are a bit finicky to install.",
                  },
                  {
                    name: "Mohammed R.",
                    date: "March 28, 2025",
                    rating: 3,
                    title: "Decent board but BIOS issues",
                    content:
                      "The hardware is good quality, but I had some issues with the BIOS that required updating. After the update things have been better, but it was frustrating to deal with initially.",
                  },
                ].map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <h4>{review.name}</h4>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <div className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`star ${star <= review.rating ? "filled" : ""}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="review-title">{review.title}</h3>
                    <p className="review-content">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Diviser name="Related Products" />
      <div className="related-products">
        {relatedProducts.map((rp) => (
          <Card
            key={rp._id}
            id={rp._id}
            name={rp.name}
            price={rp.price}
            img={rp.image}
          />
        ))}
      </div>
    </div>
  )
}

export default Product
