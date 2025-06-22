import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import { Edit, Trash2, Plus } from "lucide-react";
import "./SellerProducts.css";

function SellerProducts() {
  const { sellerId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the seller's products on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found");

        const response = await fetch("http://localhost:5000/api/products/seller", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Product fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId]);

  // Delete handler for a product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not delete product");

        // Remove product from state
        setProducts((prev) => prev.filter((p) => p._id !== id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product: " + error.message);
      }
    }
  };

  // Handler for modifying a product (redirects to edit page)
  const handleModify = (id) => {
    window.location.href = `/DashboardSeller/${sellerId}/products/${id}/edit`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Filter products based on search term (matching name or category)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-container">
      <SellerSidebar sellerId={sellerId} />
      <main className="main-content">
        <div className="page-header">
          <h1>Products</h1>
          <p>Manage your product catalog</p>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="cards-container">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              // Determine stock status and CSS class
              const stockStatus =
                product.stock > 0 ? (product.stock < 10 ? "Low Stock" : "In Stock") : "Out of Stock";
              const stockBadgeClass =
                product.stock > 0 ? (product.stock < 10 ? "badge-amber" : "badge-green") : "badge-red";

              return (
                <div key={product._id} className="card">
                  <div className="card-image">
                    <img
                      src={
                        product.image && product.image.length > 0
                          ? product.image[0]
                          : "https://via.placeholder.com/400x250"
                      }
                      alt={product.name}
                    />
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="product-name">{product.name}</h3>
                      <span className="badge badge-outline">{product.category}</span>
                    </div>
                    <div className="price-stock">
                      <p className="price">${product.price.toFixed(2)}</p>
                      <span className={`badge ${stockBadgeClass}`}>{stockStatus}</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-delete" onClick={() => handleDelete(product._id)}>
                      <Trash2 size={16} className="icon" /> Delete
                    </button>
                    <button className="btn btn-modify" onClick={() => handleModify(product._id)}>
                      <Edit size={16} className="icon" /> Modify
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-results">No products found matching your criteria.</div>
          )}
        </div>
      </main>
      <Link to={`/DashboardSeller/${sellerId}/addProduct`} className="add-product-bottom-btn">
        <Plus size={22} /> Add Product
      </Link>
    </div>
  );
}

export default SellerProducts;
