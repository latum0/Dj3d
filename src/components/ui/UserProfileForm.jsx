import React, { useState } from 'react';
import './UserProfileForm.css';

const UserProfileForm = ({ user }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User data saved:', formData);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>Edit Your Profile</h2>
      <div className="form-row">
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
      </div>
      <div className="form-row">
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
      </div>
      <h4>Password Changes</h4>
      <input type="password" placeholder="Current Password" />
      <input type="password" placeholder="New Password" />
      <input type="password" placeholder="Confirm New Password" />
      <div className="form-actions">
        <button type="button" className="cancel-btn">Cancel</button>
        <button type="submit" className="save-btn">Save Changes</button>
      </div>
    </form>
  );
};

export default UserProfileForm;
