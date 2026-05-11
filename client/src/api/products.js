import api from "./axios";

export const fetchProducts = () =>
  api.get("/admin/products");

export const createProduct = (formData) =>
  api.post("/admin/products", formData); // ✅ REMOVE headers

export const updateProduct = (id, formData) =>
  api.put(`/admin/products/${id}`, formData); // ✅ REMOVE headers

export const deleteProduct = (id) =>
  api.delete(`/admin/products/${id}`);