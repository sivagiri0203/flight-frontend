import api from "./api";

export const searchFlights = (params) =>
  api.get("/flights/search", { params }).then((r) => r.data);
