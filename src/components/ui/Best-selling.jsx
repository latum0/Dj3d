// BestS.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Diviser from './Diviser';
import './Best-selling.css';

function BestS() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the 4 most recent products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          // Sort products by createdAt (most recent first)
          const sortedProducts = result.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setProducts(sortedProducts.slice(0, 4));
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
    <div className="sales-container">
      <div className="top-best-product-container">
        <Diviser name="This Month" title="Best Selling Products" />
        <button className="view-all-button" onClick={() => navigate('/ProductListingPage')}>
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
          products.map(product => (
            <Card 
              key={product._id}
              id={product._id}
              img={product.image?.[0] || 'https://via.placeholder.com/150'}
              name={product.name}
              price={product.salePrice || product.price}
              rating={product.rating || 0}
              star={product.rating || 0}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BestS;
