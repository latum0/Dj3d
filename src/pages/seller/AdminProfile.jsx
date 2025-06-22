import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./AdminProfile.css";
import "./AdminStyles.css";

function AdminProfile() {
  const { sellerId } = useParams(); // Extract sellerId from URL
  const [sellerInfo, setSellerInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    storeName: "John's Electronics",
    storeDescription: "We sell high-quality electronics at affordable prices.",
    address: "123 Main St, Anytown, USA",
    bankName: "National Bank",
    accountNumber: "****4567",
    routingNumber: "****8901",
    paypalEmail: "john.business@example.com",
    stripeConnected: true,
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(sellerInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSellerInfo(formData);
    setEditing(false);
    // In a real app, you would save this to a backend
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="header-content">
          <h1>Seller Profile</h1>
          <p>Manage your seller information and payment methods</p>
        </div>
        <div className="header-actions">
          {/* Updated Link to dynamically redirect to the seller dashboard */}
          <Link to={`/DashboardSeller/${sellerId}`} className="back-button">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!editing && (
              <button className="edit-button" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="storeName">Store Name</label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="storeDescription">Store Description</label>
                <textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Business Address</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setEditing(false);
                    setFormData(sellerInfo);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <span className="info-label">Full Name:</span>
                <span className="info-value">{sellerInfo.name}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Email Address:</span>
                <span className="info-value">{sellerInfo.email}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Phone Number:</span>
                <span className="info-value">{sellerInfo.phone}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Store Name:</span>
                <span className="info-value">{sellerInfo.storeName}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Store Description:</span>
                <span className="info-value">{sellerInfo.storeDescription}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Business Address:</span>
                <span className="info-value">{sellerInfo.address}</span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Payment Methods</h2>
          </div>

          <div className="payment-methods">
            <div className="payment-method">
              <div className="payment-method-header">
                <h3>Bank Account</h3>
                <button className="edit-button">Edit</button>
              </div>
              <div className="payment-method-details">
                <div className="info-group">
                  <span className="info-label">Bank Name:</span>
                  <span className="info-value">{sellerInfo.bankName}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Account Number:</span>
                  <span className="info-value">{sellerInfo.accountNumber}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Routing Number:</span>
                  <span className="info-value">{sellerInfo.routingNumber}</span>
                </div>
              </div>
            </div>

            <div className="payment-method">
              <div className="payment-method-header">
                <h3>PayPal</h3>
                <button className="edit-button">Edit</button>
              </div>
              <div className="payment-method-details">
                <div className="info-group">
                  <span className="info-label">PayPal Email:</span>
                  <span className="info-value">{sellerInfo.paypalEmail}</span>
                </div>
              </div>
            </div>

            <div className="payment-method">
              <div className="payment-method-header">
                <h3>Stripe</h3>
                {sellerInfo.stripeConnected ? (
                  <span className="connected-badge">Connected</span>
                ) : (
                  <button className="connect-button">Connect</button>
                )}
              </div>
              {sellerInfo.stripeConnected && (
                <div className="payment-method-details">
                  <p>Your Stripe account is connected and ready to receive payments.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Security</h2>
          </div>
          <div className="security-options">
            <button className="security-button">Change Password</button>
            <button className="security-button">Enable Two-Factor Authentication</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
