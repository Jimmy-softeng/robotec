import api from "./axios";

export const confirmPayment = (data) => {
  return api.post("/admin/payments/confirm", data);
};
