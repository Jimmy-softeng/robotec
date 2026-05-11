import { useEffect, useState } from "react";
import { addToCart } from "../../utils/cart";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState("");

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch {
        setPopup("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (product) => {
    addToCart(product);

    setPopup(`${product.name} added to cart ✅`);

    setTimeout(() => {
      setPopup("");
    }, 2000);
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading products...</p>;

  return (
    <div style={styles.container}>
      <h1>Shop</h1>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p.id} style={styles.card}>
              <img
                src={p.image_url || "/placeholder.png"}
                alt={p.name}
                style={styles.image}
              />

              <h3>{p.name}</h3>
              <p style={styles.category}>{p.category}</p>

              <p style={styles.price}>KES {p.price}</p>

              <button
                style={styles.button}
                onClick={() => handleAddToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= POPUP ================= */}
      {popup && (
        <div style={styles.popup}>
          {popup}
          <button
            style={styles.popupBtn}
            onClick={() => navigate("/cart")}
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
    background: "#fff",
  },

  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    marginBottom: "10px",
  },

  category: {
    color: "#777",
    fontSize: "14px",
  },

  price: {
    fontWeight: "bold",
    margin: "10px 0",
  },

  button: {
    background: "#2196f3",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },

  /* ================= POPUP ================= */
  popup: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#4caf50",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 999,
  },

  popupBtn: {
    background: "#fff",
    color: "#4caf50",
    border: "none",
    padding: "5px 8px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};