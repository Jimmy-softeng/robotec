import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOrders, updateOrderStatus } from "../../api/orders";
import { confirmPayment } from "../../api/payments";
import "../../styles/admin-orders.css";

const STATUS_LABELS = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // 🔔 Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // =========================
  // LOAD ORDERS
  // =========================
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetchOrders();
      setOrders(res.data);
    } catch {
      setPopupMessage("Failed to load orders");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      loadOrders();
    } catch (err) {
      setPopupMessage(
        err?.response?.data?.message ||
          "Completed orders cannot be updated"
      );
      setShowPopup(true);
    }
  };

  // =========================
  // CONFIRM PAYMENT
  // =========================
  const handleConfirmPayment = async (orderId) => {
    const reference = prompt("Enter Mpesa reference code");
    if (!reference) return;

    try {
      await confirmPayment({
        order_id: orderId,
        method: "mpesa",
        reference,
      });

      setPopupMessage("Payment confirmed successfully");
      setShowPopup(true);
      loadOrders();
    } catch (err) {
      setPopupMessage(
        err?.response?.data?.message ||
          "Failed to confirm payment"
      );
      setShowPopup(true);
    }
  };

  // =========================
  // FILTERED ORDERS
  // =========================
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.order_number.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search);

      const matchesStatus =
        statusFilter === "all" || o.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        o.payment_status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="admin-orders">
      <h1>Orders</h1>

      {/* ================= FILTER BAR ================= */}
      <div className="orders-filters">
        <input
          type="text"
          placeholder="Search order, customer or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order No</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Update</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.order_id}>
                <td>{o.order_id}</td>
                <td>{o.order_number}</td>
                <td>{o.customer}</td>
                <td>{o.phone}</td>
                <td>KES {o.total_amount.toLocaleString()}</td>

                {/* STATUS */}
                <td>
                  <span className={`status ${o.status}`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </td>

                {/* PAYMENT */}
                <td>
                  <span className={`status ${o.payment_status}`}>
                    {STATUS_LABELS[o.payment_status] ||
                      o.payment_status}
                  </span>

                  {o.payment_status !== "paid" && (
                    <button
                      className="btn-small"
                      onClick={() =>
                        handleConfirmPayment(o.order_id)
                      }
                    >
                      Confirm
                    </button>
                  )}
                </td>

                <td>
                  {new Date(o.created_at).toLocaleString()}
                </td>

                {/* UPDATE */}
                <td>
                  <select
                    value={o.status}
                    disabled={o.status === "completed"}
                    onChange={(e) =>
                      handleStatusChange(
                        o.order_id,
                        e.target.value
                      )
                    }
                  >
                    <option value="pending_payment">
                      Pending Payment
                    </option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                {/* VIEW */}
                <td>
                  <Link
                    to={`/admin/orders/${o.order_id}`}
                    className="btn-small"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Notice</h3>
            <p>{popupMessage}</p>
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setShowPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
