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
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <p>Your cart is empty.</p>

          <Link to="/shop" style={styles.shopBtn}>
            Go to Shop
          </Link>
        </div>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td style={styles.productCell}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={styles.image}
                    />
                    {item.name}
                  </td>

                  <td>KSh {item.price}</td>

                  <td>
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

                  <td>KSh {item.price * item.quantity}</td>

                  <td>
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

          <div style={styles.summary}>
            <h3>Total: KSh {total}</h3>

            <Link to="/checkout" style={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;



/* ================= INLINE STYLES ================= */

const styles = {
  container: {
    padding: "40px"
  },

  emptyCart: {
    marginTop: "20px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  },

  productCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover"
  },

  qtyInput: {
    width: "60px",
    padding: "5px"
  },

  removeBtn: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "4px"
  },

  summary: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  checkoutBtn: {
    background: "#2196f3",
    color: "#fff",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: "4px"
  },

  shopBtn: {
    background: "#2196f3",
    color: "#fff",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: "4px"
  }
};