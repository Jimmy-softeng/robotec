import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const orderRes = await api.get(`/orders/${id}`);
        setOrder(orderRes.data);

        const settingsRes = await api.get("/settings");
        setSettings(settingsRes.data);
      } catch {
        // silent for now
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (!order) return <p style={{ padding: "20px" }}>Order not found</p>;

  return (
    <div style={styles.container}>
      <h2>Order Details</h2>

      {/* BACK BUTTON */}
      <button style={styles.backBtn} onClick={() => navigate("/orders")}>
        ← Back to Orders
      </button>

      {/* ORDER INFO */}
      <div style={styles.card}>
        <p><strong>Order #:</strong> {order.order_number}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment:</strong> {order.payment_status}</p>
      </div>

      {/* ITEMS */}
      <h3 style={{ marginTop: "20px" }}>Items</h3>

      <div style={styles.card}>
        {order.items.map((item, index) => (
          <div key={index} style={styles.item}>
            <span>{item.product_name} x {item.quantity}</span>
            <span>KES {item.subtotal}</span>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div style={styles.summary}>
        <div style={styles.row}>
          <span>Shipping</span>
          <span>KES {order.shipping_cost}</span>
        </div>

        <div style={styles.row}>
          <strong>Total</strong>
          <strong>KES {order.total_amount}</strong>
        </div>
      </div>

      {/* ✅ M-PESA INSTRUCTIONS */}
      {order.payment_status !== "paid" && (
        <div style={styles.mpesaBox}>
          <h3>M-Pesa Payment Instructions</h3>

          <p><strong>Amount:</strong> KES {order.total_amount}</p>

          <p>1. Go to M-Pesa</p>
          <p>2. Select <strong>Lipa na M-Pesa</strong></p>
          <p>3. Select <strong>Paybill</strong></p>

          <p>
            4. Business Number:{" "}
            <strong>{settings?.paybill_number || "123456"}</strong>
          </p>

          <p>
            5. Account Number:{" "}
            <strong>{order.order_id}</strong>
          </p>

          <p>6. Enter Amount and PIN</p>

          <p style={{ color: "green", marginTop: "10px" }}>
            After payment, your order will be confirmed shortly.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "40px",
    maxWidth: "600px",
    margin: "auto",
  },

  backBtn: {
    marginBottom: "20px",
    padding: "6px 12px",
    border: "none",
    background: "#eee",
    cursor: "pointer",
    borderRadius: "4px",
  },

  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "6px",
    marginTop: "10px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  summary: {
    marginTop: "20px",
    borderTop: "1px solid #ddd",
    paddingTop: "10px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
  },

  mpesaBox: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #4caf50",
    background: "#f1fff1",
    borderRadius: "6px",
  },
};