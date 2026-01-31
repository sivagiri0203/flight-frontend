import api from "./api";

export const createOrder = (bookingId) =>
  api.post("/payments/create-order", { bookingId }).then((r) => r.data);

export const verifyPayment = (payload) =>
  api.post("/payments/verify", payload).then((r) => r.data);
