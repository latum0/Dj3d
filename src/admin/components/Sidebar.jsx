"use client"
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path ? "sidebar-item active" : "sidebar-item";

  const handleLogout = async () => {
    try {
      // send the HTTP-only cookie with the request
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.warn("Logout API failed:", err);
    } finally {
      // clear any client‑side state
      localStorage.clear();

      navigate("/login");
      // force a full reload to ensure no old auth context lingers
      window.location.reload();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 22L12 2L21 22H3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="logo-text">Skill Market Admin</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={isActive("/")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" fill="#FF5252" />
            <rect x="14" y="3" width="7" height="7" rx="1" fill="#4CAF50" />
            <rect x="3" y="14" width="7" height="7" rx="1" fill="#2196F3" />
            <rect x="14" y="14" width="7" height="7" rx="1" fill="#9C27B0" />
          </svg>
          <span>Tableau de bord</span>
        </Link>
        <Link to="/produits" className={isActive("/produits")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M12 2L3 7L12 12L21 7L12 2Z"
              fill="#FFA726"
            />
            <path
              d="M3 7V17L12 22V12L3 7Z"
              fill="#FB8C00"
            />
            <path
              d="M21 7V17L12 22V12L21 7Z"
              fill="#EF6C00"
            />
          </svg>
          <span>Produits</span>
        </Link>
        <Link to="/commandes" className={isActive("/commandes")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
              fill="#78909C"
            />
            <path d="M3 6H21" stroke="#ECEFF1" strokeWidth="2" />
            <path
              d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
              stroke="#ECEFF1"
              strokeWidth="2"
            />
          </svg>
          <span>Commandes</span>
        </Link>
        <Link to="/clients" className={isActive("/clients")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <circle cx="9" cy="7" r="4" fill="#7E57C2" />
            <path
              d="M2 21V19C2 17.9391 2.42143 16.9217 3.17157 16.1716C3.92172 15.4214 4.93913 15 6 15H12C13.0609 15 14.0783 15.4214 14.8284 16.1716C15.5786 16.9217 16 17.9391 16 19V21H2Z"
              fill="#7E57C2"
            />
            <circle cx="19" cy="7" r="3" fill="#9575CD" />
            <path
              d="M22 21V19C21.9978 18.1476 21.7002 17.3196 21.1565 16.6612C20.6128 16.0028 19.8555 15.5579 19.01 15.4"
              fill="#9575CD"
            />
          </svg>
          <span>Clients</span>
        </Link>
        {/* <Link to="/paiements" className={isActive("/paiements")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <rect x="2" y="5" width="20" height="14" rx="2" fill="#29B6F6" />
            <rect x="2" y="9" width="20" height="3" fill="#0288D1" />
            <circle cx="18" cy="16" r="2" fill="#FFC107" />
            <circle cx="15" cy="16" r="2" fill="#F44336" />
          </svg>
          <span>Paiements Vendeurs</span>
        </Link> */}
        <Link to="/transactions" className={isActive("/transactions")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <rect x="2" y="12" width="4" height="8" fill="#9C27B0" />
            <rect x="8" y="8" width="4" height="12" fill="#673AB7" />
            <rect x="14" y="4" width="4" height="16" fill="#3F51B5" />
            <rect x="20" y="2" width="2" height="18" fill="#2196F3" />
            <path d="M2 22H22" stroke="#455A64" strokeWidth="1" />
          </svg>
          <span>Transactions</span>
        </Link>
        <Link to="/category" className={isActive("/category")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <rect x="2" y="12" width="4" height="8" fill="#9C27B0" />
            <rect x="8" y="8" width="4" height="12" fill="#673AB7" />
            <rect x="14" y="4" width="4" height="16" fill="#3F51B5" />
            <rect x="20" y="2" width="2" height="18" fill="#2196F3" />
            <path d="M2 22H22" stroke="#455A64" strokeWidth="1" />
          </svg>
          <span>Category</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
              fill="#FF9800"
            />
            <path
              d="M16 17L21 12L16 7"
              stroke="#E65100"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="#E65100"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Déconnexion</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
