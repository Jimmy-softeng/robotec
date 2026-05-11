import api from "./axios";

export const fetchSettings = () =>
  api.get("/admin/settings");

export const updateSettings = (payload) =>
  api.put("/admin/settings", payload);
