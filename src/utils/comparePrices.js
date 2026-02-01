export function comparePrices(flights, cabinClass = "economy") {
  if (!Array.isArray(flights)) return [];

  return flights
    .map((f) => ({
      airline: f.airline?.name || f.airlineName || "Unknown",
      flightNo: f.flight?.iata || f.flight?.number,
      cabinClass,
      price: f.price?.[cabinClass] ?? f.amount ?? 0,
    }))
    .filter(f => f.price > 0)
    .sort((a, b) => a.price - b.price);
}
