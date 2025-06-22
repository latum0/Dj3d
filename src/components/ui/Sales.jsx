// AllProductsSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import './AllProductsSection.css';
import Diviser from './Diviser';

const Sales = () => {
  const [products, setProducts] = useState([]); // State to store fetched products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          // Limit to 4 products for this section
          setProducts(result.data.slice(0, 4));
        } else {
          throw new Error(result.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="products-section">
      {/* Divider Component */}
      <div className="diviser-container">
        <Diviser name="Sales" />
      </div>

      {/* Section Header */}
      <div className="section-header">
        <h2>Explore Our Products</h2>
        <button className="view-all-button" onClick={() => navigate('/ProductListingPage')}>
          View All
        </button>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <Card
              key={product._id} // Use MongoDB _id as the unique key
              id={product._id}
              name={product.name}
              price={product.salePrice || product.price} // Use salePrice if available
              star={product.rating || 0} // Default to 0 if rating is missing
              rating={product.rating || 0}
              img={product.image?.[0] || 'https://via.placeholder.com/150'} // Use the first image or a placeholder
              sellerId={product.seller}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Sales;
