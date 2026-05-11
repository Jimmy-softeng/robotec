import api from "./axios";

export const fetchProductReviews = (productId) =>
  api.get(`/products/${productId}/reviews`);

export const deleteReview = (reviewId) =>
  api.delete(`/admin/reviews/${reviewId}`);
