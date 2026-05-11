import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, getCartTotal, clearCart } from "../../utils/cart";
import { createOrder } from "../../api/orders";
import api from "../../api/axios";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const cartItems = getCart();
  const total = getCartTotal();

  const [shippingOptions, setShippingOptions] = useState([]);
  const [settings, setSettings] = useState(null);

  const [form, setForm] = useState({
    guest_name: "",
    guest_phone: "",
    guest_email: "",
    city: "",
    town: "",
    address: "",
    shipping_cost: 0,
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);

  /* ================= LOAD SHIPPING ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const shipRes = await api.get("/shipping-options");
        setShippingOptions(shipRes.data);

        const setRes = await api.get("/settings");
        setSettings(setRes.data);
      } catch {
        setPopup("Failed to load checkout data");
      }
    };

    loadData();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SHIPPING ================= */
  const handleShippingChange = (e) => {
    const selected = shippingOptions.find(
      (opt) => opt.id === parseInt(e.target.value)
    );

    setForm({
      ...form,
      shipping_cost: selected?.cost || 0,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setPopup("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        items: cartItems,
      };

      const res = await createOrder(payload);

      const orderId = res.data.order_id;

      // 🔥 SHOW PAYMENT INSTRUCTIONS
      setPaymentInfo({
        orderId,
        total: total + Number(form.shipping_cost),
      });

      clearCart();

    } catch (err) {
      setPopup(
        err?.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Checkout</h2>

      <div style={styles.grid}>
        {/* ================= FORM ================= */}
        <form style={styles.form} onSubmit={handleSubmit}>
          {!user && (
            <>
              <input
                name="guest_name"
                placeholder="Full Name"
                required
                onChange={handleChange}
              />

              <input
                name="guest_phone"
                placeholder="Phone (07XXXXXXXX)"
                required
                onChange={handleChange}
              />

              <input
                name="guest_email"
                placeholder="Email"
                required
                onChange={handleChange}
              />
            </>
          )}

          <input
            name="city"
            placeholder="City"
            required
            onChange={handleChange}
          />

          <input
            name="town"
            placeholder="Town"
            required
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
          />

          <select required onChange={handleShippingChange}>
            <option value="">Select Shipping Area</option>
            {shippingOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.area_name} - KES {opt.cost}
              </option>
            ))}
          </select>

          <button style={styles.button} disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        {/* ================= SUMMARY ================= */}
        <div style={styles.summary}>
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item.id} style={styles.item}>
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>KES {item.price * item.quantity}</span>
            </div>
          ))}

          <hr />

          <div style={styles.total}>
            <strong>Subtotal:</strong>
            <span>KES {total}</span>
          </div>

          <div style={styles.total}>
            <strong>Shipping:</strong>
            <span>KES {form.shipping_cost}</span>
          </div>

          <div style={styles.total}>
            <strong>Total:</strong>
            <span>
              KES {total + Number(form.shipping_cost)}
            </span>
          </div>
        </div>
      </div>

      {/* ================= PAYMENT MODAL ================= */}
      {paymentInfo && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>M-Pesa Payment Instructions</h3>

            <p><strong>Order ID:</strong> {paymentInfo.orderId}</p>
            <p><strong>Amount:</strong> KES {paymentInfo.total}</p>

            <hr />

            <p>1. Go to M-Pesa</p>
            <p>2. Select <strong>Lipa na M-Pesa</strong></p>
            <p>3. Select <strong>Paybill</strong></p>
            <p>
              4. Business Number:{" "}
              <strong>{settings?.paybill_number || "123456"}</strong>
            </p>
            <p>
              5. Account Number:{" "}
              <strong>{paymentInfo.orderId}</strong>
            </p>
            <p>6. Enter Amount and PIN</p>

            <p style={{ marginTop: "10px", color: "green" }}>
              After payment, your order will be confirmed shortly.
            </p>

            <button
              style={styles.button}
              onClick={() => {
                setPaymentInfo(null);
                navigate("/");
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ================= POPUP ================= */}
      {popup && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p>{popup}</p>
            <button onClick={() => setPopup("")}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    marginTop: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  button: {
    background: "#2196f3",
    color: "#fff",
    padding: "10px",
    border: "none",
    cursor: "pointer",
  },

  summary: {
    border: "1px solid #ddd",
    padding: "20px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
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
    width: "350px",
  },
};