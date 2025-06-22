import React from "react";
import { Link } from "react-router-dom";
import "./SellerSidebar.css";
import { LayoutDashboard, Package, Box, ShoppingCart, BarChart2, User, Store } from "lucide-react";

function SellerSidebar({ sellerId }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, path: `/DashboardSeller/${sellerId}` },
    { id: "products", label: "Products", icon: <Package size={18} />, path: `/DashboardSeller/${sellerId}/products` },
    { id: "inventory", label: "Inventory", icon: <Box size={18} />, path: `/DashboardSeller/${sellerId}/inventory` },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={18} />, path: `/DashboardSeller/${sellerId}/orders` },
    { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} />, path: `/DashboardSeller/${sellerId}/analytics` },
    { id: "profile", label: "Profile", icon: <User size={18} />, path: `/DashboardSeller/${sellerId}/profile` },
  ];

  return (
    <header className="top-nav-sidebar">
      <div className="nav-header">
        <Link to="/" className="nav-logo">
          <Store size={24} />
          <span className="nav-title">Seller Dashboard</span>
        </Link>
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <Link key={item.id} to={item.path} className="nav-item">
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default SellerSidebar;
