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

    // ✅ FIXED IMAGE
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url, // ✅ IMPORTANT FIX
      quantity: 1,
    };

    addToCart(cartProduct);

    setPopup(`${product.name} added to cart ✅`);

    setTimeout(() => {
      setPopup("");
    }, 2000);
  };

  if (loading) {
    return (
      <p style={{ padding: "20px" }}>
        Loading products...
      </p>
    );
  }

  return (
    <div style={styles.container}>

      <h1 style={styles.heading}>
        Shop
      </h1>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div style={styles.grid}>

          {products.map((p) => (
            <div
              key={p.id}
              style={styles.card}
            >

              <img
                src={p.image_url || "/placeholder.png"}
                alt={p.name}
                style={styles.image}
              />

              <h3 style={styles.productName}>
                {p.name}
              </h3>

              <p style={styles.category}>
                {p.category}
              </p>

              <p style={styles.price}>
                KES {Number(p.price).toLocaleString()}
              </p>

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

          <span>{popup}</span>

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
    maxWidth: "1400px",
    margin: "0 auto",
  },

  heading: {
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },

  card: {
    border: "1px solid #e0e0e0",
    padding: "15px",
    borderRadius: "10px",
    background: "#fff",
    textAlign: "center",
    transition: "0.3s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "12px",
  },

  productName: {
    marginBottom: "8px",
    fontSize: "18px",
  },

  category: {
    color: "#777",
    fontSize: "14px",
    marginBottom: "10px",
  },

  price: {
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "15px",
    color: "#2196f3",
  },

  button: {
    background: "#2196f3",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    width: "100%",
    fontWeight: "bold",
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
    flexWrap: "wrap",
  },

  popupBtn: {
    background: "#fff",
    color: "#4caf50",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "4px",
    fontWeight: "bold",
  },
};