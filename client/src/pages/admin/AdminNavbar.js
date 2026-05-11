import { useNavigate } from "react-router-dom";
import "../../styles/admin-navbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); 
  // assuming you store { first_name, last_name, role }

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`
    : "A";

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="admin-navbar">
      <div className="admin-navbar-left">
        <h2>Admin Panel</h2>
      </div>

      <div className="admin-navbar-right">
        <div className="admin-user">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <span className="name">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="role">{user?.role}</span>
          </div>
        </div>

        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
