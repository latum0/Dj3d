import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import {
  MdOutlineShoppingCart,
  MdAccountCircle,
  MdLogout,
  MdDesignServices,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import neoLogo from "../../assets/logoNeo.png"

const Header = () => {
  const RAW_API = import.meta.env.VITE_API_URL || "";
  const API_BASE = RAW_API.replace(/\/$/, "");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // underline state for nav links
  const [links, setLinks] = useState({
    home: true,
    about: false,
    contact: false,
    customorder: false,
    login: false,
  });

  // update underline based on current URL
  useEffect(() => {
    const p = location.pathname;
    setLinks({
      home: p === "/",
      about: p.startsWith("/about"),
      contact: p.startsWith("/contact"),
      customorder: p.startsWith("/custom-order"),
      login: p.startsWith("/login"),
    });
  }, [location.pathname]);

  // handle clicks on nav links
  const linkNavbar = (e, name) => {
    e.preventDefault();
    setLinks({
      home: name === "home",
      about: name === "about",
      contact: name === "contact",
      customorder: name === "customorder",
      login: name === "login",
    });
    if (name === "home") navigate("/");
    else if (name === "login") navigate("/login");
    else if (name === "customorder") navigate("/custom-order");
    else navigate(`/${name}`);
  };

  // search + typeahead
  const [searchTerm, setSearchTerm] = useState("");
  const [recs, setRecs] = useState([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const fetchRecs = async (q) => {
    const t = q.trim();
    if (t.length < 2) {
      setRecs([]);
      setOpen(false);
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/products/search?q=${encodeURIComponent(
          t
        )}`
      );
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setRecs(data.slice(0, 5));
      setOpen(true);
    } catch {
      setRecs([]);
      setOpen(false);
    }
  };

  const onInput = (e) => {
    setSearchTerm(e.target.value);
    fetchRecs(e.target.value);
  };

  const onSearch = (e) => {
    e.preventDefault();
    const q = inputRef.current.value.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchTerm("");
    setOpen(false);
  };

  // logout handler using API and then navigate
  const handleLogout = async () => {
    try {
      await logout(); // calls your logout API handler
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="main-nav-container">
      <div className="main-navbar-wrapper">
        <header className="main-navbar">

          <div className="main-navbar-logo" onClick={() => navigate("/")}>
            <img
              src={neoLogo}
              alt="Logo"
              className="main-logo-img"
            />
          </div>


          <div className="main-navbar-center">
            <nav className="main-navbar-links">
              <a href="/" onClick={(e) => linkNavbar(e, "home")}>
                Home {links.home && <div className="main-line-under"></div>}
              </a>
              <a href="/about" onClick={(e) => linkNavbar(e, "about")}>
                About {links.about && <div className="main-line-under"></div>}
              </a>
              <a href="/contact" onClick={(e) => linkNavbar(e, "contact")}>
                Contact {links.contact && <div className="main-line-under"></div>}
              </a>

              {!user && (
                <a href="/login" onClick={(e) => linkNavbar(e, "login")}>
                  Login {links.login && <div className="main-line-under"></div>}
                </a>
              )}
            </nav>
          </div>


          <div className="main-navbar-right">
            <div className="main-search-wrapper" ref={wrapperRef}>
              <form onSubmit={onSearch}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="What are you looking for?"
                  className="main-search-input"
                  value={searchTerm}
                  onChange={onInput}
                />
              </form>
              {open && recs.length > 0 && (
                <ul className="main-recommendations-dropdown">
                  {recs.map((p) => (
                    <li
                      key={p._id}
                      onClick={() => navigate(`/product/${p._id}`)}
                    >
                      <img
                        src={p.image?.[0] || "https://via.placeholder.com/50"}
                        alt={p.name}
                      />
                      <div>
                        <p>{p.name}</p>
                        <p>${p.price.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="main-navbar-icons">

              <button
                className="main-custom-order-btn"
                onClick={() => navigate("/custom-order")}
                title="Create Custom Order"
              >
                <MdDesignServices className="main-custom-order-icon" />
                <span className="main-custom-order-text">Custom</span>
              </button>


              <MdOutlineShoppingCart
                className="main-cart-logo"
                onClick={() => navigate("/cart")}
                title="Shopping Cart"
              />


              {user && (
                <>
                  <MdAccountCircle
                    className="main-profile-logo"
                    onClick={() => navigate("/accountPage")}
                    title="My Account"
                  />
                  <MdLogout
                    className="main-logout-icon"
                    onClick={handleLogout}
                    title="Logout"
                  />
                </>
              )}
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;