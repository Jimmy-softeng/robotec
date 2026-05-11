import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/admin.css";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Robotec Admin</h2>

        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/shipping">Shipping</Link>
          <Link to="/admin/settings">Settings</Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Top Navbar */}
        <header className="admin-navbar">
          <h3>Admin Panel</h3>

          <div className="admin-navbar-right">
            <span className="admin-name">
              {user?.first_name} {user?.last_name}
            </span>

            <div className="avatar-wrapper">
              <div
                className="admin-avatar"
                onClick={() => setShowMenu(!showMenu)}
              >
                {initials}
              </div>

              {showMenu && (
                <div className="avatar-menu">
                  <button onClick={logout} title="Logout">
                    ⏻ Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
