import api from "./axios";

export const fetchUsers = () =>
  api.get("/admin/users");

export const updateUser = (userId, payload) =>
  api.put(`/admin/users/${userId}`, payload);

export const deactivateUser = (userId) =>
  api.delete(`/admin/users/${userId}`);
