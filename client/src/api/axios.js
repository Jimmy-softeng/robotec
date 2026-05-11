import axios from "axios";
import { getSessionId } from "../utils/session"; // ✅ ADD THIS

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

/* ==========================
   HELPER: check if auth route
   ========================== */
const isAuthRoute = (url) => {
  return (
    url.startsWith("/auth/login") ||
    url.startsWith("/auth/register") ||
    url.startsWith("/auth/verify")
  );
};

/* ==========================
   REQUEST: attach token + session
   ========================== */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token && !isAuthRoute(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ ADD THIS (CRITICAL)
  config.headers["X-Session-ID"] = getSessionId();

  return config;
});

/* ==========================
   RESPONSE: handle expiry
   ========================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      window.dispatchEvent(new CustomEvent("session-expired"));
    }

    return Promise.reject(error);
  }
);

export default api;