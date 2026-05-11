import api from "./axios";

export const fetchOrders = () =>
  api.get("/admin/orders");

export const updateOrderStatus = (orderId, status) =>
  api.put(`/admin/orders/${orderId}/status`, {
    status: status,
  });
export const fetchOrderDetail = (orderId) =>
  api.get(`/orders/${orderId}`);

// Create order (guest OR logged user)
export const createOrder = (data) =>
  api.post("/checkout", data);