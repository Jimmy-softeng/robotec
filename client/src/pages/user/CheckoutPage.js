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

  /* ================= LOAD DATA ================= */
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      <h2 style={styles.heading}>
        Checkout
      </h2>

      <div style={styles.grid}>

        {/* ================= FORM ================= */}
        <form
          style={styles.form}
          onSubmit={handleSubmit}
        >

          {!user && (
            <>
              <input
                style={styles.input}
                name="guest_name"
                placeholder="Full Name"
                required
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="guest_phone"
                placeholder="Phone (07XXXXXXXX)"
                required
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="guest_email"
                placeholder="Email"
                required
                onChange={handleChange}
              />
            </>
          )}

          <input
            style={styles.input}
            name="city"
            placeholder="City"
            required
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="town"
            placeholder="Town"
            required
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
          />

          <select
            style={styles.input}
            required
            onChange={handleShippingChange}
          >
            <option value="">
              Select Shipping Area
            </option>

            {shippingOptions.map((opt) => (
              <option
                key={opt.id}
                value={opt.id}
              >
                {opt.area_name} - KES {opt.cost}
              </option>
            ))}
          </select>

          <button
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        {/* ================= SUMMARY ================= */}
        <div style={styles.summary}>

          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div
              key={item.id}
              style={styles.item}
            >
              <span>
                {item.name} x {item.quantity}
              </span>

              <span>
                KES {item.price * item.quantity}
              </span>
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

          <div style={styles.totalFinal}>
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

            <h3 style={styles.modalTitle}>
              M-Pesa Payment Instructions
            </h3>

            <div style={styles.paymentBox}>
              <p>
                <strong>Order ID:</strong>{" "}
                {paymentInfo.orderId}
              </p>

              <p>
                <strong>Amount:</strong>{" "}
                KES {paymentInfo.total}
              </p>
            </div>

            <hr />

            <div style={styles.instructions}>
              <p>1. Open M-Pesa</p>

              <p>
                2. Select{" "}
                <strong>Lipa na M-Pesa</strong>
              </p>

              <p>
                3. Select{" "}
                <strong>Buy Goods & Services</strong>
              </p>

              <p>
                4. Enter Till Number:
              </p>

              <div style={styles.tillBox}>
                {settings?.till_number || "4315116"}
              </div>

              <p>
                5. Enter Amount:
                <strong>
                  {" "}KES {paymentInfo.total}
                </strong>
              </p>

              <p>
                6. Confirm and enter PIN
              </p>
            </div>

            <p style={styles.successText}>
              After payment, your order will
              be confirmed shortly.
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

            <button
              style={styles.button}
              onClick={() => setPopup("")}
            >
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
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  heading: {
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    background: "#fff",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },

  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    width: "100%",
    boxSizing: "border-box",
  },

  button: {
    background: "#2196f3",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },

  summary: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    background: "#fff",
    height: "fit-content",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
  },

  totalFinal: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2196f3",
  },

  /* ================= OVERLAY FIX ================= */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    zIndex: 999,
  },

  /* ================= MODAL FIX (IMPORTANT) ================= */
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "420px",

    /* 🔥 FIX SCROLL ISSUE */
    maxHeight: "90vh",
    overflowY: "auto",

    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxSizing: "border-box",
  },

  modalTitle: {
    marginTop: 0,
    marginBottom: "10px",
    color: "#2196f3",
  },

  paymentBox: {
    background: "#f5f9ff",
    padding: "12px",
    borderRadius: "6px",
  },

  instructions: {
    fontSize: "14px",
    lineHeight: "1.6",
  },

  tillBox: {
    background: "#2196f3",
    color: "#fff",
    textAlign: "center",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "22px",
    fontWeight: "bold",
    margin: "10px 0",
  },

  successText: {
    marginTop: "10px",
    color: "green",
    fontWeight: "500",
  },
};
