import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import { Cuboid as CubeIcon, Box } from "lucide-react";
import "./Inventory.css";

function Inventory() {
  const { sellerId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Missing authentication token");

        const response = await fetch("http://localhost:5000/api/products/seller", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const result = await response.json();
        const fetchedProducts = result.data || [];

        const formattedProducts = fetchedProducts.map((product) => ({
          id: product._id,
          name: product.name,
          sku: product.sku || "N/A",
          stock: product.stock,
          status: getStockStatus(product.stock),
          variants: [],
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError("Could not load product inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId]);

  const getStockStatus = (stock) => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (stockFilter === "all" ||
      (stockFilter === "in-stock" && product.status === "In Stock") ||
      (stockFilter === "low-stock" && product.status === "Low Stock") ||
      (stockFilter === "out-of-stock" && product.status === "Out of Stock"))
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <SellerSidebar sellerId={sellerId} />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Inventory</h1>
            <p>Manage your product inventory and stock levels</p>
          </div>
          <div className="user-avatar">
            <img src="https://via.placeholder.com/40" alt="User" />
          </div>
        </div>

        <div className="filters-container">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-filter">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Variants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="product-name">{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`badge ${product.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      {product.variants.length > 0 ? (
                        product.variants.map((variant, index) => (
                          <div key={index} className="variant-item">
                            {variant.name}: {variant.stock}
                          </div>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <div className="stock-actions">
                        <input
                          type="number"
                          min="0"
                          defaultValue={product.stock}
                          className="stock-input"
                        />
                        <button className="update-button">
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Inventory;