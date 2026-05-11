import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import ChangePassword from "./pages/user/ChangePassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminShipping from "./pages/admin/AdminShipping";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";

import CartPage from "./pages/user/CartPage";
import Shop from "./pages/user/Shop";
import UserLayout from "./pages/user/UserLayout";
import CheckoutPage from "./pages/user/CheckoutPage";
import UserOrders from "./pages/user/UserOrders";
import OrderDetails from "./pages/user/OrderDetails";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import SessionExpiredModal from "./pages/components/SessionExpiredModal";

function App() {
  return (
    <BrowserRouter>

      {/* SESSION MODAL */}
      <SessionExpiredModal />

      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/auth" element={<AuthPage />} />

        {/* ================= USER AREA ================= */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Shop />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />

          {/* CHANGE PASSWORD */}
          <Route
            path="change-password"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* ORDERS LIST */}
          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <UserOrders />
              </ProtectedRoute>
            }
          />

          {/* ✅ ORDER DETAILS (FIXED) */}
          <Route
            path="orders/:id"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= ADMIN AREA ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="shipping" element={<AdminShipping />} />
          <Route path="products/:productId/reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;