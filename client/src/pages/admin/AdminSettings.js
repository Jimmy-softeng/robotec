import { useEffect, useState, useCallback } from "react";
import { fetchSettings, updateSettings } from "../../api/settings";
import "../../styles/admin-settings.css";

const AdminSettings = () => {
  const [form, setForm] = useState({
    shop_name: "",
    paybill_number: "",
    paybill_account: "",
    shipping_cost: "",
    support_phone: "",
    support_email: "",
    shop_address: "",
  });

  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState("");

  /* ================= LOAD ================= */
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetchSettings();
      setForm({
        shop_name: res.data.shop_name || "",
        paybill_number: res.data.paybill_number || "",
        paybill_account: res.data.paybill_account || "",
        shipping_cost: res.data.shipping_cost || "",
        support_phone: res.data.support_phone || "",
        support_email: res.data.support_email || "",
        shop_address: res.data.shop_address || "",
      });
    } catch {
      setPopup("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateSettings({
        ...form,
        shipping_cost: Number(form.shipping_cost),
      });
      setPopup("Settings updated successfully");
    } catch {
      setPopup("Failed to update settings");
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="admin-settings">
      <h1>Shop Settings</h1>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Shop Name</label>
          <input
            name="shop_name"
            value={form.shop_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Paybill Number</label>
          <input
            name="paybill_number"
            value={form.paybill_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Paybill Account</label>
          <input
            name="paybill_account"
            value={form.paybill_account}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Default Shipping Cost (KES)</label>
          <input
            type="number"
            name="shipping_cost"
            value={form.shipping_cost}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Support Phone</label>
          <input
            name="support_phone"
            value={form.support_phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Support Email</label>
          <input
            type="email"
            name="support_email"
            value={form.support_email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Shop Address</label>
          <textarea
            name="shop_address"
            value={form.shop_address}
            onChange={handleChange}
          />
        </div>

        <button className="btn-primary">Save Settings</button>
      </form>

      {/* ============ POPUP MODAL ============ */}
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

export default AdminSettings;
