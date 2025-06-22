import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import {
  MdOutlineShoppingCart,
  MdAccountCircle,
  MdLogout,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // underline state for nav links
  const [links, setLinks] = useState({
    home: true,
    about: false,
    contact: false,
    login: false,
  });

  // update underline based on current URL
  useEffect(() => {
    const p = location.pathname;
    setLinks({
      home: p === "/",
      about: p.startsWith("/about"),
      contact: p.startsWith("/contact"),
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
      login: name === "login",
    });
    if (name === "home") navigate("/");
    else if (name === "login") navigate("/login");
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
        `http://localhost:5000/api/products/search?q=${encodeURIComponent(
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
    <div className="nav-container">
      <header className="navbar">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img
            src="/src/assets/logoMC.png"
            alt="Logo"
            className="logo-img"
          />
        </div>

        {/* Center Links */}
        <div className="navbar-center">
          <nav className="navbar-links">
            <a href="/" onClick={(e) => linkNavbar(e, "home")}>
              Home {links.home && <div className="lineUnder"></div>}
            </a>
            <a href="/about" onClick={(e) => linkNavbar(e, "about")}>
              About {links.about && <div className="lineUnder"></div>}
            </a>
            <a href="/contact" onClick={(e) => linkNavbar(e, "contact")}>
              Contact {links.contact && <div className="lineUnder"></div>}
            </a>
            {!user && (
              <a href="/login" onClick={(e) => linkNavbar(e, "login")}>
                Login {links.login && <div className="lineUnder"></div>}
              </a>
            )}
          </nav>
        </div>

        {/* Search + Icons */}
        <div className="navbar-right">
          <div className="search-wrapper" ref={wrapperRef}>
            <form onSubmit={onSearch}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Que cherchez-vous ?"
                className="modern-search-input"
                value={searchTerm}
                onChange={onInput}
              />
            </form>
            {open && recs.length > 0 && (
              <ul className="recommendations-dropdown">
                {recs.map((p) => (
                  <li
                    key={p._id}
                    onClick={() => navigate(`/products/${p._id}`)}
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

          <div className="navbar-icons">
            {/* Cart always */}
            <MdOutlineShoppingCart
              className="cart-logo"
              onClick={() => navigate("/cart")}
              title="Panier"
            />

            {/* Profile & Logout only when logged in */}
            {user && (
              <>
                <MdAccountCircle
                  className="profile-logo"
                  onClick={() => navigate("/accountpage")}
                  title="Mon Compte"
                />
                <MdLogout
                  className="logout-icon"
                  onClick={handleLogout}
                  title="Déconnexion"
                />
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
