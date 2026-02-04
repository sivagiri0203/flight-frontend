import api from "./api";

// GET /api/amadeus/offers?origin=MAA&destination=DEL&date=2026-02-11&adults=1&travelClass=ECONOMY&max=20
export function searchAmadeusOffers({ origin, destination, date, adults, travelClass, max }) {
  return api.get("/amadeus/offers", {
    params: {
      origin,
      destination,
      date,
      adults,
      travelClass,
      max,
    },
  });
}