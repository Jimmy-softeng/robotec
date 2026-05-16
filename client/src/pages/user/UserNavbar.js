import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getCartCount } from "../../utils/cart";

const UserNavbar = () => {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  // ✅ MOBILE MENU
  const [mobileMenu, setMobileMenu] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    const updateCart = () => {
      setCartCount(getCartCount());
    };

    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    updateCart();
    loadUser();

    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  /* ================= USER INITIALS ================= */
  const getInitials = () => {
    if (!user) return "";

    return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();
  };

  return (
    <div>

      {/* ================= TOP BAR ================= */}
      <div style={topBar}>
        Welcome to Robotec - Your One-Stop Shop for Arduino Gadgets!
      </div>

      {/* ================= NAVBAR ================= */}
      <nav style={navStyle}>

        {/* ================= LOGO ================= */}
        <div
          style={logoContainer}
          onClick={() => navigate("/")}
        >
          <img
            src="/robotec.jpeg"
            alt="Robotec Logo"
            style={logoImage}
          />
        </div>

        {/* ================= HAMBURGER ================= */}
        <div
          style={hamburger}
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          ☰
        </div>

        {/* ================= NAV LINKS ================= */}
        <div
          style={{
            ...navLinks,
            ...(mobileMenu ? mobileNavActive : {}),
          }}
        >

          <Link
            to="/"
            style={linkStyle}
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>

          <Link
            to="/shop"
            style={linkStyle}
            onClick={() => setMobileMenu(false)}
          >
            Shop
          </Link>

          <Link
            to="/cart"
            style={linkStyle}
            onClick={() => setMobileMenu(false)}
          >
            Cart ({cartCount})
          </Link>

          {/* ================= GUEST USER ================= */}
          {!user && (
            <Link
              to="/auth"
              style={loginBtn}
              onClick={() => setMobileMenu(false)}
            >
              Login
            </Link>
          )}

          {/* ================= LOGGED IN USER ================= */}
          {user && (
            <div
              style={{ position: "relative" }}
              ref={dropdownRef}
            >

              {/* AVATAR */}
              <div
                style={avatar}
                onClick={() => setOpen(!open)}
              >
                {getInitials()}
              </div>

              {/* DROPDOWN */}
              {open && (
                <div style={dropdown}>

                  <p style={userName}>
                    {user.first_name} {user.last_name}
                  </p>

                  <hr />

                  <div
                    style={menuItem}
                    onClick={() => {
                      navigate("/orders");
                      setOpen(false);
                    }}
                  >
                    📦 My Orders
                  </div>

                  <div
                    style={menuItem}
                    onClick={() => {
                      navigate("/change-password");
                      setOpen(false);
                    }}
                  >
                    🔑 Change Password
                  </div>

                  <div
                    style={menuItem}
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </nav>

    </div>
  );
};

export default UserNavbar;

/* ================= STYLES ================= */

const topBar = {
  backgroundColor: "#2196f3",
  color: "white",
  textAlign: "center",
  padding: "8px",
  fontSize: "14px"
};

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 20px",
  borderBottom: "1px solid #eee",
  background: "#fff",
  position: "relative",
  flexWrap: "wrap"
};

const logoContainer = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer"
};

const logoImage = {
  width: "300px",
  height: "70px",
  objectFit: "cover",
  borderRadius: "8px",
  maxWidth: "100%"
};

const navLinks = {
  display: "flex",
  gap: "25px",
  alignItems: "center"
};

const mobileNavActive = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginTop: "15px",
  gap: "15px",
  alignItems: "flex-start"
};

const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontWeight: "500"
};

const loginBtn = {
  textDecoration: "none",
  background: "#2196f3",
  color: "white",
  padding: "8px 16px",
  borderRadius: "4px",
  fontWeight: "500"
};

const avatar = {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  background: "#2196f3",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  cursor: "pointer"
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: "45px",
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "6px",
  width: "180px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  zIndex: 1000
};

const userName = {
  padding: "10px",
  margin: 0,
  fontWeight: "bold"
};

const menuItem = {
  padding: "10px",
  cursor: "pointer",
  fontSize: "14px"
};

const hamburger = {
  display: window.innerWidth <= 768 ? "block" : "none",
  fontSize: "28px",
  cursor: "pointer",
  color: "#2196f3"
};