import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SessionExpiredModal = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setShow(true);

    window.addEventListener("session-expired", handler);
    return () =>
      window.removeEventListener("session-expired", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setShow(false);
    navigate("/auth");
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal danger">
        <h3>Session Expired</h3>
        <p>
          Your session has expired.
          <br />
          Please log in again.
        </p>

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={handleLogout}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
