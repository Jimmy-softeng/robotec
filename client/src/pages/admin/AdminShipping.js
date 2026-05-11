import { useEffect, useState, useCallback } from "react";
import {
  fetchShippingOptions,
  createShippingOption,
  updateShippingOption,
  deleteShippingOption,
} from "../../api/shipping";
import "../../styles/admin-shipping.css";

const AdminShipping = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    area_name: "",
    cost: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [popup, setPopup] = useState("");

  /* ================= LOAD ================= */
  const loadOptions = useCallback(async () => {
    try {
      const res = await fetchShippingOptions();
      setOptions(res.data);
    } catch {
      setPopup("Failed to load shipping options");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateShippingOption(editingId, form);
        setPopup("Shipping option updated");
      } else {
        await createShippingOption(form);
        setPopup("Shipping option created");
      }

      setForm({ area_name: "", cost: "" });
      setEditingId(null);
      loadOptions();
    } catch {
      setPopup("Failed to save shipping option");
    }
  };

  /* ================= EDIT ================= */
  const startEdit = (opt) => {
    setEditingId(opt.id);
    setForm({
      area_name: opt.area_name,
      cost: opt.cost,
    });
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      await deleteShippingOption(deleteTarget.id);
      setPopup("Shipping option removed");
      loadOptions();
    } catch {
      setPopup("Failed to delete shipping option");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <p>Loading shipping options...</p>;

  return (
    <div className="admin-shipping">
      <h1>Shipping Options</h1>

      {/* ============ FORM ============ */}
      <form className="shipping-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Area name (e.g. Kilimani)"
          value={form.area_name}
          required
          onChange={(e) =>
            setForm({ ...form, area_name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Cost"
          value={form.cost}
          required
          onChange={(e) =>
            setForm({ ...form, cost: e.target.value })
          }
        />

        <button className="btn-primary">
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEditingId(null);
              setForm({ area_name: "", cost: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* ============ TABLE ============ */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Area</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {options.map((opt) => (
            <tr key={opt.id}>
              <td>{opt.id}</td>
              <td>{opt.area_name}</td>
              <td>KES {Number(opt.cost).toLocaleString()}</td>
              <td className="actions">
                <button
                  className="btn-small"
                  onClick={() => startEdit(opt)}
                >
                  Edit
                </button>
                <button
                  className="btn-danger btn-small"
                  onClick={() => setDeleteTarget(opt)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ============ DELETE MODAL ============ */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal danger">
            <h3>Delete Shipping Option</h3>
            <p>
              Delete <strong>{deleteTarget.area_name}</strong>?
            </p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ INFO POPUP ============ */}
      {popup && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{popup}</p>
            <button
              className="btn-primary"
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

export default AdminShipping;
