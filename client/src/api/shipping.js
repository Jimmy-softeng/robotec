import api from "./axios";

export const fetchShippingOptions = () =>
  api.get("/admin/shipping-options");

export const createShippingOption = (payload) =>
  api.post("/admin/shipping-options", payload);

export const updateShippingOption = (id, payload) =>
  api.put(`/admin/shipping-options/${id}`, payload);

export const deleteShippingOption = (id) =>
  api.delete(`/admin/shipping-options/${id}`);
