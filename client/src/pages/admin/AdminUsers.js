import { useEffect, useState, useCallback } from "react";
import { fetchUsers, updateUser, deactivateUser } from "../../api/users";
import "../../styles/admin-users.css";

const USERS_PER_PAGE = 8;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [page, setPage] = useState(1);

  const [popup, setPopup] = useState({ show: false, message: "" });
  const [userToDeactivate, setUserToDeactivate] = useState(null);

  /* ========================
     FETCH USERS
     ======================== */
  const loadUsers = useCallback(async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch {
      setPopup({ show: true, message: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /* ========================
     FILTER + SEARCH
     ======================== */
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.first_name} ${u.last_name} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" ? true : u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  /* ========================
     PAGINATION
     ======================== */
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  /* ========================
     ACTIONS
     ======================== */
  const handleRoleChange = async (userId, role) => {
    try {
      await updateUser(userId, { role });
      loadUsers();
    } catch {
      setPopup({ show: true, message: "Failed to update role" });
    }
  };

  const confirmDeactivate = async () => {
    if (!userToDeactivate) return;

    try {
      await deactivateUser(userToDeactivate.id);
      setPopup({
        show: true,
        message: `${userToDeactivate.first_name} has been deactivated`,
      });
      loadUsers();
    } catch {
      setPopup({ show: true, message: "Failed to deactivate user" });
    } finally {
      setUserToDeactivate(null);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-users">
      <h1>User Management</h1>

      {/* ================= FILTER BAR ================= */}
      <div className="users-filters">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* ================= USERS TABLE ================= */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.is_active ? (
                  <span className="status active">Active</span>
                ) : (
                  <span className="status inactive">Inactive</span>
                )}
              </td>
              <td className="actions">
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleRoleChange(u.id, e.target.value)
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                {u.is_active && (
                  <button
                    className="btn-danger btn-small"
                    onClick={() => setUserToDeactivate(u)}
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* ================= DEACTIVATE MODAL ================= */}
      {userToDeactivate && (
        <div className="modal-overlay">
          <div className="modal danger">
            <h3>Deactivate User</h3>
            <p>
              Are you sure you want to deactivate{" "}
              <strong>
                {userToDeactivate.first_name}{" "}
                {userToDeactivate.last_name}
              </strong>
              ?
            </p>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setUserToDeactivate(null)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmDeactivate}
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= INFO POPUP ================= */}
      {popup.show && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{popup.message}</p>
            <button
              className="btn-primary"
              onClick={() => setPopup({ show: false, message: "" })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
