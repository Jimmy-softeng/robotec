export const getSessionId = () => {
  let sessionId = localStorage.getItem("session_id");

  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2);
    localStorage.setItem("session_id", sessionId);
  }

  return sessionId;
};