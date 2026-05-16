import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  updateQuantity,
  getCartTotal
} from "../../utils/cart";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  const loadCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    loadCart();
  };

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;

    updateQuantity(id, qty);
    loadCart();
  };

  const total = getCartTotal();

  return (
    <div style={styles.container}>

      <h2 style={styles.heading}>
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>

          <p>Your cart is empty.</p>

          <Link
            to="/shop"
            style={styles.shopBtn}
          >
            Go to Shop
          </Link>

        </div>
      ) : (
        <>
          {/* ================= RESPONSIVE TABLE ================= */}
          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>
                  <th style={styles.tableHeader}>Product</th>
                  <th style={styles.tableHeader}>Price</th>
                  <th style={styles.tableHeader}>Quantity</th>
                  <th style={styles.tableHeader}>Total</th>
                  <th style={styles.tableHeader}>Action</th>
                </tr>
              </thead>

              <tbody>

                {cartItems.map((item) => (
                  <tr key={item.id}>

                    {/* PRODUCT */}
                    <td style={{ ...styles.tableCell, ...styles.productCell }}>

                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        style={styles.image}
                      />

                      <span>{item.name}</span>

                    </td>

                    {/* PRICE */}
                    <td style={styles.tableCell}>
                      KSh {Number(item.price).toLocaleString()}
                    </td>

                    {/* QUANTITY */}
                    <td style={styles.tableCell}>

                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        style={styles.qtyInput}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                      />

                    </td>

                    {/* TOTAL */}
                    <td style={styles.tableCell}>
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </td>

                    {/* ACTION */}
                    <td style={styles.tableCell}>

                      <button
                        onClick={() => handleRemove(item.id)}
                        style={styles.removeBtn}
                      >
                        Remove
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* ================= SUMMARY ================= */}
          <div style={styles.summary}>

            <h3>
              Total: KSh {total.toLocaleString()}
            </h3>

            <Link
              to="/checkout"
              style={styles.checkoutBtn}
            >
              Proceed to Checkout
            </Link>

          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1300px",
    margin: "0 auto"
  },

  heading: {
    marginBottom: "20px"
  },

  emptyCart: {
    marginTop: "30px",
    textAlign: "center"
  },

  /* ================= TABLE ================= */

  tableWrapper: {
    width: "100%",
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "750px",
    background: "#fff",
    border: "1px solid #eee"
  },

  tableHeader: {
    borderBottom: "2px solid #ddd",
    padding: "14px",
    textAlign: "left",
    background: "#f9f9f9",
    fontSize: "15px"
  },

  tableCell: {
    borderBottom: "1px solid #eee",
    padding: "14px",
    verticalAlign: "middle"
  },

  productCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "220px"
  },

  image: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },

  qtyInput: {
    width: "70px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },

  removeBtn: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: "4px",
    fontWeight: "bold"
  },

  /* ================= SUMMARY ================= */

  summary: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px"
  },

  checkoutBtn: {
    background: "#2196f3",
    color: "#fff",
    padding: "12px 20px",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold"
  },

  shopBtn: {
    background: "#2196f3",
    color: "#fff",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: "5px",
    display: "inline-block",
    marginTop: "10px"
  }
};