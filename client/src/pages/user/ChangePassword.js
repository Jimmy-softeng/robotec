import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState("");

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      setPopup("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/change-password", {
        current_password: form.current_password,
        new_password: form.new_password,
      });

      setPopup("Password changed successfully ✅");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setPopup(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Change Password</h2>

      <form style={styles.form} onSubmit={handleSubmit}>

        <input
          type="password"
          name="current_password"
          placeholder="Current Password"
          required
          onChange={handleChange}
        />

        <input
          type="password"
          name="new_password"
          placeholder="New Password"
          required
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm New Password"
          required
          onChange={handleChange}
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>

      </form>

      {/* ================= POPUP ================= */}
      {popup && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p>{popup}</p>
            <button onClick={() => setPopup("")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "40px",
    maxWidth: "400px",
    margin: "auto",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },

  button: {
    background: "#2196f3",
    color: "#fff",
    padding: "10px",
    border: "none",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "6px",
  },
};