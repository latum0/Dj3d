import React from "react";
import "./wishlist.css";
import { FaEye, FaShoppingCart, FaHeart, FaSearch, FaUser } from "react-icons/fa";

const Wishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Gucci duffle bag",
      price: 960,
      originalPrice: 1160,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jJRVueouvkkyztQvPWCq6lFk1GSGxC.png",
      discount: "-35%"
    },
    {
      id: 2,
      name: "RGB liquid CPU Cooler",
      price: 1560,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jJRVueouvkkyztQvPWCq6lFk1GSGxC.png"
    },
    {
      id: 3,
      name: "GP11 Shooter USB Gamepad",
      price: 550,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jJRVueouvkkyztQvPWCq6lFk1GSGxC.png"
    },
    {
      id: 4,
      name: "Quilted Satin Jacket",
      price: 750,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jJRVueouvkkyztQvPWCq6lFk1GSGxC.png"
    }
  ];

  const recommendedItems = [
    {
      id: 5,
      name: "ASUS FHD Gaming Laptop",
      price: 960,
      originalPrice: 1160,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jJRVueouvkkyztQvPWCq6lFk1GSGxC.png",
      rating: 5,
      reviews: 65,
      discount: "-35%"
    },
    {
      id: 6,
      name: "IPS LCD Gaming Monitor",
      price: 1160,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jJRVueouvkkyztQvPWCq6lFk1GSGxC.png",
      rating: 5,
      reviews: 65
    },
    {
      id: 7,
      name: "HAVIT HV-G92 Gamepad",
      price: 560,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jJRVueouvkkyztQvPWCq6lFk1GSGxC.png",
      rating: 5,
      reviews: 65,
      isNew: true
    },
    {
      id: 8,
      name: "AK-900 Wired Keyboard",
      price: 200,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jJRVueouvkkyztQvPWCq6lFk1GSGxC.png",
      rating: 5,
      reviews: 65
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const renderProductCard = (product, showRating = false) => (
    <div className="product-card" key={product.id}>
      <div className="product-image-container">
        {product.discount && <div className="discount-badge">{product.discount}</div>}
        {product.isNew && <div className="new-badge">NEW</div>}
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
        <button className="quick-view-btn">
          <FaEye />
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="current-price">${product.price}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice}</span>
          )}
        </div>
        {showRating && (
          <div className="product-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="reviews">({product.reviews})</span>
          </div>
        )}
      </div>
      <button className="add-to-cart-btn">
        <FaShoppingCart /> Add To Cart
      </button>
    </div>
  );

  return (
    <div className="exclusive-shop">
      {/* Announcement Bar */}
      

      

      {/* Main Content */}
      <main className="main-content">
        <div className="wishlist-header">
          <h1 className="wishlist-title">Wishlist (4)</h1>
          <button className="move-all-btn">Move All To Bag</button>
        </div>

        <div className="product-grid">
          {wishlistItems.map(product => renderProductCard(product))}
        </div>

        <div className="section-header">
          <div className="section-title">
            <div className="title-indicator"></div>
            <h2>Just For You</h2>
          </div>
          <button className="move-all-btn">See All</button>
          
        </div>

        <div className="product-grid">
          {recommendedItems.map(product => renderProductCard(product, true))}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
