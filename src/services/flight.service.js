import api from "./api"; // make sure this points to your axios instance

export function searchFlights({ depIata, arrIata, date, limit }) {
  return api.get("/flights/search", {
    params: {
      depIata,     // ✅ correct key name
      arrIata,
      date,
      limit,
    },
  });
}
