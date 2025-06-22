import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h4>Manage My Account</h4>
      <ul>
        <li className="active">My Profile</li>
        <li>Address Book</li>
        <li>My Payment Options</li>
      </ul>
      <h4>My Orders</h4>
      <ul>
        <li>My Returns</li>
        <li>My Cancellations</li>
      </ul>
      <h4>My Wishlist</h4>
    </div>
  );
};

export default Sidebar;
