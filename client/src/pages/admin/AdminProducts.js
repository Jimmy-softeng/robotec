import { useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products";
import { uploadImage } from "../../utils/uploadImage";
import "../../styles/admin-products.css";
import { Link } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [message, setMessage] = useState("");

  const emptyForm = {
    name: "",
    category: "",
    price: "",
    stock_quantity: "",
    description: "",
    image: null,
  };

  const [form, setForm] = useState(emptyForm);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res.data);
    } catch {
      setMessage("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ================= MODALS ================= */
  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock_quantity: product.stock_quantity,
      description: product.description || "",
      image: null,
    });
    setShowModal(true);
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    try {
      let imageUrl = editingProduct?.image_url || null;

      // Upload image to Supabase
      if (form.image) {
        imageUrl = await uploadImage(form.image);
      }

      Object.keys(form).forEach((key) => {
        if (key !== "image" && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      if (imageUrl) {
        formData.append("image_url", imageUrl);
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        setMessage("✅ Product updated successfully");
      } else {
        await createProduct(formData);
        setMessage("✅ Product created successfully");
      }

      setShowModal(false);
      setEditingProduct(null);
      loadProducts();

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save product");
    }
  };

  /* ================= DELETE (SOFT DELETE) ================= */
  const handleDelete = async () => {
    try {
      await deleteProduct(deleteTarget.id);
      setMessage("🗑️ Product deactivated successfully");
      setDeleteTarget(null);
      loadProducts();
    } catch {
      setMessage("❌ Failed to delete product");
    }
  };

  /* ================= RESTORE ================= */
  const handleRestore = async (product) => {
    try {
      const formData = new FormData();
      formData.append("is_active", true);

      await updateProduct(product.id, formData);

      setMessage("✅ Product restored successfully");
      loadProducts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to restore product");
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <h1>Products</h1>
        <button className="btn-primary" onClick={openAddModal}>
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    src={p.image_url || "/placeholder.png"}
                    alt={p.name}
                    className="product-thumb"
                  />
                </td>

                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>KES {Number(p.price).toLocaleString()}</td>
                <td>{p.stock_quantity}</td>

                {/* STATUS */}
                <td>
                  {p.is_active ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Active
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Inactive
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="actions">
                  <button
                    className="btn-icon"
                    title="Edit"
                    onClick={() => openEditModal(p)}
                  >
                    ✏️
                  </button>

                  {p.is_active ? (
                    <button
                      className="btn-icon btn-delete"
                      title="Deactivate"
                      onClick={() => setDeleteTarget(p)}
                    >
                      🗑️
                    </button>
                  ) : (
                    <button
                      className="btn-icon"
                      title="Restore"
                      onClick={() => handleRestore(p)}
                      style={{ color: "green" }}
                    >
                      ♻️
                    </button>
                  )}

                  <Link
                    to={`/admin/products/${p.id}/reviews`}
                    className="btn-small btn-outline"
                  >
                    Reviews
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                required
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />

              <input
                name="stock_quantity"
                type="number"
                placeholder="Stock quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />

              <input type="file" name="image" onChange={handleChange} />

              <div className="modal-actions">
                <button className="btn-primary">
                  {editingProduct ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h2>Deactivate Product</h2>
            <p>
              Are you sure you want to deactivate{" "}
              <strong>{deleteTarget.name}</strong>?
            </p>
            <p className="danger-text">You can restore it later.</p>

            <div className="modal-actions">
              <button className="btn-danger" onClick={handleDelete}>
                Yes, Deactivate
              </button>
              <button
                className="btn-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE MODAL */}
      {message && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{message}</p>
            <button
              className="btn-primary"
              onClick={() => setMessage("")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;