// Analytics.jsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import {
  BarChart2,
  Box,
  ShoppingCart,
  User,
  Menu,
  TrendingUp,
  DollarSign,
  Users,
  X
} from "lucide-react";
import "./Analytics.css";

function Analytics() {
  const { sellerId } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [revenueTab, setRevenueTab] = useState("monthly");
  
  const revenueData = [
    { name: "Jan", revenue: 4000, profit: 2400 },
    { name: "Feb", revenue: 3000, profit: 1398 },
    { name: "Mar", revenue: 9800, profit: 5800 },
    { name: "Apr", revenue: 3908, profit: 2908 },
    { name: "May", revenue: 4800, profit: 3800 },
    { name: "Jun", revenue: 3800, profit: 2800 }
  ];
  
  const topProducts = [
    { name: "Wireless Headphones", revenue: 12500, percentage: 35 },
    { name: "Smart Watch", revenue: 8750, percentage: 25 },
    { name: "Bluetooth Speaker", revenue: 5250, percentage: 15 },
    { name: "Laptop Stand", revenue: 3500, percentage: 10 },
    { name: "Wireless Mouse", revenue: 5250, percentage: 15 }
  ];

  return (
    <div className="dashboardLayout">
      <SellerSidebar sellerId={sellerId} />
      <main className="mainContentArea">
        <header className="headerBar">
          <div className="headerLeft">
            <button className="menuToggle" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1 className="headerTitle">Analytics Dashboard</h1>
              <p className="headerSubtitle">Track your business performance and growth</p>
            </div>
          </div>
          <div className="userProfile">
            <span className="notificationBadge">3</span>
            <div className="userAvatar">JD</div>
          </div>
        </header>
        
        <div className="statsGrid">
          <div className="statCard revenue">
            <div className="statHeader">
              <DollarSign className="statIcon" />
              <h3>Total Revenue</h3>
            </div>
            <div className="statBody">
              <span className="statValue">$45,231.89</span>
              <div className="statTrend positive">
                <TrendingUp size={16} />
                <span>+20.1%</span>
              </div>
            </div>
            <p className="statTrend">vs. last month</p>
          </div>
          
          <div className="statCard orders">
            <div className="statHeader">
              <ShoppingCart className="statIcon" />
              <h3>Total Orders</h3>
            </div>
            <div className="statBody">
              <span className="statValue">573</span>
              <div className="statTrend positive">
                <TrendingUp size={16} />
                <span>+12.5%</span>
              </div>
            </div>
            <p className="statTrend">vs. last month</p>
          </div>
          
          <div className="statCard customers">
            <div className="statHeader">
              <Users className="statIcon" />
              <h3>Total Customers</h3>
            </div>
            <div className="statBody">
              <span className="statValue">1,249</span>
              <div className="statTrend positive">
                <TrendingUp size={16} />
                <span>+8.2%</span>
              </div>
            </div>
            <p className="statTrend">vs. last month</p>
          </div>
        </div>
        
        <div className="chartsGrid">
          <div className="graphCard revenueChart">
            <div className="graphHeader">
              <h2 className="graphTitle">Revenue & Profit</h2>
              <div className="graphTabs">
                <button
                  className={`graphTab ${revenueTab === "weekly" ? "active" : ""}`}
                  onClick={() => setRevenueTab("weekly")}
                >
                  Weekly
                </button>
                <button
                  className={`graphTab ${revenueTab === "monthly" ? "active" : ""}`}
                  onClick={() => setRevenueTab("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`graphTab ${revenueTab === "yearly" ? "active" : ""}`}
                  onClick={() => setRevenueTab("yearly")}
                >
                  Yearly
                </button>
              </div>
            </div>
            
            <div className="graphContent">
              <div className="barGraph">
                {revenueData.map((item, index) => (
                  <div key={index} className="barGroup">
                    <div className="barLabel">{item.name}</div>
                    <div className="barContainer">
                      <div
                        className="bar revenueBar"
                        style={{ height: `${(item.revenue / 10000) * 200}px` }}
                        title={`Revenue: $${item.revenue}`}
                      />
                      <div
                        className="bar profitBar"
                        style={{ height: `${(item.profit / 10000) * 200}px` }}
                        title={`Profit: $${item.profit}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="legendContainer">
              <div className="legendItem">
                <span className="legendMarker revenueMarker"></span>
                <span>Revenue</span>
              </div>
              <div className="legendItem">
                <span className="legendMarker profitMarker"></span>
                <span>Profit</span>
              </div>
            </div>
          </div>
          
          <div className="graphCard productsChart">
            <div className="graphHeader">
              <h2 className="graphTitle">Top Products</h2>
              <select className="periodSelect">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
            
            <div className="productsList">
              {topProducts.map((product, index) => (
                <div key={index} className="productItem">
                  <div className="productInfo">
                    <h4>{product.name}</h4>
                    <span className="productRevenue">${product.revenue.toLocaleString()}</span>
                  </div>
                  <div className="progressBar">
                    <div
                      className="progress"
                      style={{ width: `${product.percentage}%` }}
                    />
                  </div>
                  <span className="percentage">{product.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Analytics;