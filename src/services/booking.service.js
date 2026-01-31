import api from "./api";

export const createBooking = (data) => api.post("/bookings", data).then((r) => r.data);
export const myBookings = () => api.get("/bookings/me").then((r) => r.data);
export const bookingById = (id) => api.get(`/bookings/${id}`).then((r) => r.data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`).then((r) => r.data);
