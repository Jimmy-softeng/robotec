import axios from "axios";
import { getSessionId } from "../utils/session";

/* ==========================
   API URL
========================== */
const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: API_URL,
});

/* ==========================
   HELPER: AUTH ROUTES
========================== */
const isAuthRoute = (url = "") => {
  return (
    url.startsWith("/auth/login") ||
    url.startsWith("/auth/register") ||
    url.startsWith("/auth/verify")
  );
};

/* ==========================
   REQUEST INTERCEPTOR
========================== */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access_token");

    // Add token to protected routes
    if (token && !isAuthRoute(config.url)) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // Guest cart session
    config.headers["X-Session-ID"] =
      getSessionId();

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==========================
   RESPONSE INTERCEPTOR
========================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired
    if (error.response?.status === 401) {
      localStorage.removeItem(
        "access_token"
      );
      localStorage.removeItem("user");

      window.dispatchEvent(
        new CustomEvent("session-expired")
      );
    }

    return Promise.reject(error);
  }
);

export default api;