import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const UserOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState("");

  /* ================= LOAD ORDERS ================= */
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch {
        setPopup("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} style={styles.card}>
            <p><strong>Order #:</strong> {order.order_number}</p>
            <p><strong>Total:</strong> KES {order.total_amount}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Payment:</strong> {order.payment_status}</p>

            {/* ✅ BUTTON */}
            <button
              style={styles.button}
              onClick={() => navigate(`/orders/${order.order_id}`)}
            >
              View Details
            </button>
          </div>
        ))
      )}

      {/* POPUP */}
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

export default UserOrders;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "40px",
  },

  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "6px",
    marginBottom: "15px",
  },

  button: {
    marginTop: "10px",
    background: "#2196f3",
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
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