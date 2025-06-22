import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import { MoreVertical, Eye } from "lucide-react";
import "./Orders.css";

function Orders() {
  const { sellerId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Missing authentication token");

        const response = await fetch("http://localhost:5000/api/orders/seller", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch orders");

        const result = await response.json();
        setOrders(result.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
        setError("Could not load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sellerId]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return (statusFilter === "all" || order.status === statusFilter) && matchesSearch;
  });

  if (loading) {
    return (
      <div className="orders-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-wrapper">
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-wrapper">
      <SellerSidebar sellerId={sellerId} />

      <main className="orders-main">
        <div className="page-header">
          <h1>Orders</h1>
          <p>Manage and process customer orders</p>
        </div>

        <div className="filters-container">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>
                      <p>{order.user?.name}</p>
                      <span>{order.user?.email}</span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className={`badge ${order.status.toLowerCase()}`}>{order.status}</td>
                    <td>${order.totalAmount?.toFixed(2)}</td>
                    <td>
                      <div className="actions">
                        <Link to={`/DashboardSeller/${sellerId}/orders/${order._id}`} className="btn-icon">
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-orders">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Orders;
