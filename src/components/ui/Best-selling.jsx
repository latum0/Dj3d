// src/components/BestS.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Diviser from './Diviser';
import './Best-selling.css';

function BestS({ name, title }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Grab API URL from env (must be prefixed with VITE_)
  const RAW_API = import.meta.env.VITE_API_URL || '';
  // Remove any trailing slash to normalize
  const API_BASE = RAW_API.replace(/\/$/, '');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch products');
        }

        // Sort by newest and take first 4
        const sorted = result.data
          .slice() // clone before sort
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        setProducts(sorted);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE]);

  return (
    <div className="sales-container">
      <div className="top-best-product-container">
        <Diviser name={name} title={title} />
        <button
          className="view-all-button"
          onClick={() => navigate('/ProductListingPage')}
        >
          View All
        </button>
      </div>

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
              key={product._id}
              id={product._id}
              img={product.image?.[0] ?? 'https://via.placeholder.com/150'}
              name={product.name}
              price={product.salePrice ?? product.price}
              rating={product.rating ?? 0}
              star={product.rating ?? 0}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BestS;
