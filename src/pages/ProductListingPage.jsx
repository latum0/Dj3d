// ProductListingPage.jsx
import React, { useState, useEffect } from "react";
import {
  FiGrid,
  FiList,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import Card from "../components/ui/Card";
import "./ProductListingPage.css";

// Filters Component
const Filters = ({ activeFilters, onFilterChange, products }) => {
  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    brands: true,
    ratings: true,
  });

  const [priceRange, setPriceRange] = useState({
    min: activeFilters.priceRange.min,
    max: activeFilters.priceRange.max,
  });

  // Extract unique categories and brands from products
  const categories = [...new Set(
    products.map((product) => {
      // If category is populated object, use its name, otherwise use the ID or string
      if (product.category && typeof product.category === 'object' && product.category.name) {
        return product.category.name;
      }
      return product.category;
    })
  )].filter(Boolean);

  const brands = [...new Set(products.map((product) => product.brand))].filter(Boolean);

  // Find min and max prices in products (with fallback)
  const prices = products.map((product) => product.price || 0);
  const minProductPrice = prices.length ? Math.min(...prices) : 0;
  const maxProductPrice = prices.length ? Math.max(...prices) : 0;

  useEffect(() => {
    setPriceRange({
      min: activeFilters.priceRange.min,
      max: activeFilters.priceRange.max,
    });
  }, [activeFilters.priceRange]);

  const toggleSection = (section) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section],
    });
  };

  const handleCategoryChange = (category) => {
    let newCategories;
    if (activeFilters.categories.includes(category)) {
      newCategories = activeFilters.categories.filter((c) => c !== category);
    } else {
      newCategories = [...activeFilters.categories, category];
    }
    onFilterChange({ categories: newCategories });
  };

  const handleBrandChange = (brand) => {
    let newBrands;
    if (activeFilters.brands.includes(brand)) {
      newBrands = activeFilters.brands.filter((b) => b !== brand);
    } else {
      newBrands = [...activeFilters.brands, brand];
    }
    onFilterChange({ brands: newBrands });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange({
      ...priceRange,
      [name]: Number.parseInt(value, 10) || 0,
    });
  };

  const applyPriceRange = () => {
    onFilterChange({ priceRange });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ ratings: rating === activeFilters.ratings ? 0 : rating });
  };

  return (
    <div className="filters">
      {/* Categories Filter */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("categories")}>
          <h3>Categories</h3>
          {expanded.categories ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {expanded.categories && (
          <div className="filter-content">
            {categories.map((category) => (
              <label key={category} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={activeFilters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="checkbox-label">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("price")}>
          <h3>Price Range</h3>
          {expanded.price ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {expanded.price && (
          <div className="filter-content">
            <div className="price-inputs">
              <div className="price-input-group">
                <label>Min</label>
                <input
                  type="number"
                  name="min"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                  min={minProductPrice}
                  max={priceRange.max}
                />
              </div>
              <div className="price-input-group">
                <label>Max</label>
                <input
                  type="number"
                  name="max"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                  min={priceRange.min}
                  max={maxProductPrice}
                />
              </div>
            </div>
            <div className="price-slider">
              <input
                type="range"
                min={minProductPrice}
                max={maxProductPrice}
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: Number.parseInt(e.target.value, 10) })
                }
              />
              <input
                type="range"
                min={minProductPrice}
                max={maxProductPrice}
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: Number.parseInt(e.target.value, 10) })
                }
              />
            </div>
            <button className="apply-price" onClick={applyPriceRange}>
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Brands Filter */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("brands")}>
          <h3>Brands</h3>
          {expanded.brands ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {expanded.brands && (
          <div className="filter-content">
            {brands.map((brand) => (
              <label key={brand} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={activeFilters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <span className="checkbox-label">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Ratings Filter */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("ratings")}>
          <h3>Ratings</h3>
          {expanded.ratings ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {expanded.ratings && (
          <div className="filter-content">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                className={`rating-option ${activeFilters.ratings === rating ? "active" : ""}`}
                onClick={() => handleRatingChange(rating)}
              >
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">
                  {rating === 5 ? "5 Stars" : `${rating} Stars & Up"`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductListingPage = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for fetched products and filtering
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Other UI states
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000000 },
    brands: [],
    ratings: 0,
  });

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setAllProducts(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch products');
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

  // Apply filters and sorting on fetched products
  useEffect(() => {
    let result = [...allProducts];

    // Category filter
    if (activeFilters.categories.length > 0) {
      result = result.filter((product) =>
        activeFilters.categories.includes(product.category)
      );
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.price >= activeFilters.priceRange.min &&
        product.price <= activeFilters.priceRange.max
    );

    // Brand filter
    if (activeFilters.brands.length > 0) {
      result = result.filter((product) =>
        activeFilters.brands.includes(product.brand)
      );
    }

    // Rating filter
    if (activeFilters.ratings > 0) {
      result = result.filter((product) => product.rating >= activeFilters.ratings);
    }

    // Sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Use createdAt timestamp generated by Mongoose
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // "featured" – keep original order
        break;
    }

    setFilteredProducts(result);
  }, [activeFilters, sortOption, allProducts]);

  const handleFilterChange = (newFilters) => {
    setActiveFilters({ ...activeFilters, ...newFilters });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      priceRange: { min: 0, max: 1000000 },
      brands: [],
      ratings: 0,
    });
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  return (
    <div className="product-listing-page">
      <div className="product-listing-header">
        <h1>All Products</h1>
        <div className="breadcrumb">
          <span>Home</span> / <span>Products</span>
        </div>
      </div>

      <div className="product-listing-container">
        {/* Mobile filter toggle */}
        <button className="mobile-filter-toggle" onClick={toggleMobileFilters}>
          <FiFilter /> Filters
        </button>

        {/* Filters sidebar */}
        <aside className={`filters-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
          <div className="filters-header">
            <h2>Filters</h2>
            <button className="clear-filters" onClick={clearAllFilters}>
              Clear All
            </button>
            <button className="close-filters-mobile" onClick={toggleMobileFilters}>
              <FiX />
            </button>
          </div>
          <Filters
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            products={allProducts}
          />
        </aside>

        {/* Main content */}
        <main className="product-listing-content">
          <div className="product-listing-toolbar">
            <div className="product-count">
              Showing {filteredProducts.length} of {allProducts.length} products
            </div>

            <div className="product-controls">
              <div className="view-switcher">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid />
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <FiList />
                </button>
              </div>

              <div className="sort-control">
                <label htmlFor="sort">Sort by:</label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters to find what you're looking for.</p>
              <button className="reset-filters" onClick={clearAllFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <Card
                  key={product._id || product.id}
                  id={product._id || product.id}
                  name={product.name}
                  img={
                    product.image && Array.isArray(product.image)
                      ? product.image[0]
                      : product.image || 'https://via.placeholder.com/150'
                  }
                  price={(product.salePrice || product.price)?.toFixed
                    ? ((product.salePrice || product.price)).toFixed(2)
                    : '0.00'}
                  star={product.rating || 0}
                  rating={product.rating || 0}
                />
              ))}
            </div>
          )}

          {/* Simple pagination */}
          <div className="pagination">
            <button disabled>&laquo; Previous</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next &raquo;</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductListingPage;
