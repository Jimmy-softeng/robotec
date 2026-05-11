import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  fetchProductReviews,
  deleteReview,
} from "../../api/reviews";
import "../../styles/admin-reviews.css";

const AdminReviews = () => {
  const { productId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [popup, setPopup] = useState("");

  /* ================= LOAD ================= */
  const loadReviews = useCallback(async () => {
    try {
      const res = await fetchProductReviews(productId);
      setReviews(res.data);
    } catch {
      setPopup("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      await deleteReview(deleteTarget.review_id);
      setPopup("Review deleted");
      loadReviews();
    } catch {
      setPopup("Failed to delete review");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="admin-reviews">
      <h1>Product Reviews</h1>

      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((r) => (
              <tr key={r.review_id}>
                <td>{r.review_id}</td>
                <td>{r.user}</td>
                <td>{"⭐".repeat(r.rating)}</td>
                <td>{r.comment}</td>
                <td>
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => setDeleteTarget(r)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ============ DELETE MODAL ============ */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal danger">
            <h3>Delete Review</h3>
            <p>
              Delete review by{" "}
              <strong>{deleteTarget.user}</strong>?
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

export default AdminReviews;
