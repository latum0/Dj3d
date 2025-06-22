
import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import "./OrderDetails.css"
import "./AdminStyles.css";

function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  // Mock order data
  const orderData = {
    id: id || "ORD-001",
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Anytown, CA 12345",
    },
    products: [
      {
        id: "PROD-001",
        name: "Wireless Headphones",
        price: 129.99,
        quantity: 1,
        total: 129.99,
      },
    ],
    status: "delivered",
    date: "2023-04-23",
    shipping: {
      method: "Standard Shipping",
      cost: 5.99,
      tracking: "TRK123456789",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "4242",
    },
    subtotal: 129.99,
    tax: 10.4,
    total: 146.38,
  }

  const [status, setStatus] = useState(orderData.status)

  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setStatus(newStatus)
      setIsLoading(false)
      alert(`Order status updated to ${newStatus}`)
    }, 1000)
  }

  return (
    <div className="order-details-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="icon-package"></i>
            <span>Seller Dashboard</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <i className="icon-home"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/products" className="nav-item">
            <i className="icon-package"></i>
            <span>Products</span>
          </Link>
          <Link to="/inventory" className="nav-item">
            <i className="icon-box"></i>
            <span>Inventory</span>
          </Link>
          <Link to="/orders" className="nav-item active">
            <i className="icon-shopping-cart"></i>
            <span>Orders</span>
          </Link>
          <Link to="/analytics" className="nav-item">
            <i className="icon-bar-chart"></i>
            <span>Analytics</span>
          </Link>
          <Link to="/profile" className="nav-item">
            <i className="icon-user"></i>
            <span>Profile</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <div className="order-header">
          <div className="order-title">
            <div className="order-id-badge">
              <h2>Order #{id}</h2>
              <span className={`badge ${status}`}>{status}</span>
            </div>
            <p>Placed on {orderData.date}</p>
          </div>
          <div className="order-actions">
            <select value={status} onChange={handleStatusChange} disabled={isLoading} className="status-select">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn btn-outline" onClick={() => navigate("/orders")}>
              Back to Orders
            </button>
          </div>
        </div>

        {/* Order Information */}
        <div className="order-info-grid">
          {/* Customer Information */}
          <div className="card">
            <div className="card-header">
              <h3>Customer Information</h3>
            </div>
            <div className="card-content">
              <div className="info-section">
                <h4>Contact Details</h4>
                <p>{orderData.customer.name}</p>
                <p>{orderData.customer.email}</p>
                <p>{orderData.customer.phone}</p>
              </div>
              <div className="info-section">
                <h4>Shipping Address</h4>
                <p>{orderData.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="card">
            <div className="card-header">
              <h3>Order Information</h3>
            </div>
            <div className="card-content">
              <div className="info-section">
                <h4>Payment</h4>
                <p>
                  {orderData.payment.method} ending in {orderData.payment.cardLast4}
                </p>
              </div>
              <div className="info-section">
                <h4>Shipping</h4>
                <p>{orderData.shipping.method}</p>
                <p>Tracking: {orderData.shipping.tracking}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card order-items-card">
          <div className="card-header">
            <h3>Order Items</h3>
          </div>
          <div className="card-content">
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.products.map((product) => (
                  <tr key={product.id}>
                    <td className="product-name">{product.name}</td>
                    <td className="text-right">${product.price.toFixed(2)}</td>
                    <td className="text-right">{product.quantity}</td>
                    <td className="text-right">${product.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>${orderData.shipping.cost.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${orderData.tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderDetails
