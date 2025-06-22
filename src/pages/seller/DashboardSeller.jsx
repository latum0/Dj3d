import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import "./DashboardSeller.css";
import { Package, Activity } from "lucide-react";

function DashboardSeller() {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Missing authentication token");

        const productsRes = await fetch("http://localhost:5000/api/products/seller", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!productsRes.ok) throw new Error("Failed to fetch products");

        const productsData = await productsRes.json();
        setProducts(productsData.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err.message);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <SellerSidebar sellerId={sellerId} />

      <main className="dashboard-main">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your store performance</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <Package size={24} className="stat-icon" />
            <div className="stat-info">
              <h3>Total Products</h3>
              <p>{products.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <Activity size={24} className="stat-icon" />
            <div className="stat-info">
              <h3>Active Listings</h3>
              <p>{products.length}</p>
            </div>
          </div>
        </div>

        <div className="product-list">
          <h2>Seller Products</h2>
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-products">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardSeller;
