import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { generateInvoicePDF } from "../../utils/generateInvoice";
import "../../styles/admin-order-detail.css";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch {
        alert("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="admin-order-detail">
      <div className="detail-header">
        <h1>Order #{order.order_number}</h1>

        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back to Orders
        </button>
      </div>

      {/* ORDER SUMMARY */}
      <div className="order-summary">
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment:</strong> {order.payment_status}</p>
        <p><strong>Subtotal:</strong> KES {order.subtotal.toLocaleString()}</p>
        <p><strong>Shipping:</strong> KES {order.shipping_cost.toLocaleString()}</p>
        <p className="total">
          <strong>Total:</strong> KES {order.total_amount.toLocaleString()}
        </p>
      </div>

      {/* ORDER ITEMS */}
      <h2>Items to Deliver</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td>{item.product_name}</td>
              <td>KES {item.product_price.toLocaleString()}</td>
              <td>{item.quantity}</td>
              <td>KES {item.subtotal.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ACTIONS */}
<div className="invoice-actions">
  <button
    className="btn-primary"
    onClick={() => generateInvoicePDF(order, "print")}
  >
    🖨 Print Invoice
  </button>

  <button
    className="btn-secondary"
    onClick={() => generateInvoicePDF(order, "download")}
  >
    📥 Download PDF
  </button>
</div>

    </div>
  );
};

export default AdminOrderDetail;
