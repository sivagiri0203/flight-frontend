// src/utils/priceEngine.js
const CABIN_MULTIPLIER = { economy: 1.0, premium: 1.35, business: 2.1, first: 3.0 };

const AIRLINE_MULTIPLIER = {
  AI: 1.2,
  UK: 1.25,
  "6E": 1.05,
  SG: 1.0,
  G8: 0.98,
  DEFAULT: 1.12,
};

function demandFactor(dateStr) {
  if (!dateStr) return 1.0;
  const day = new Date(dateStr).getDay();
  if (day === 5 || day === 6) return 1.12;
  if (day === 0) return 1.08;
  return 1.0;
}

function baseFare(depIata, arrIata) {
  // Simple fallback route pricing (edit later)
  if (depIata === "MAA" && arrIata === "DEL") return 4499;
  if (depIata === "DEL" && arrIata === "BOM") return 3999;
  return 3299;
}

export function buildCabinPrices({ airlineIata, depIata, arrIata, date }) {
  const airlineFactor = AIRLINE_MULTIPLIER[airlineIata] || AIRLINE_MULTIPLIER.DEFAULT;
  const base = baseFare(depIata, arrIata);
  const demand = demandFactor(date);

  const cabins = Object.keys(CABIN_MULTIPLIER).map((cls) => ({
    class: cls,
    price: Math.round(base * airlineFactor * CABIN_MULTIPLIER[cls] * demand),
  }));

  return { cabins, minPrice: Math.min(...cabins.map((c) => c.price)), currency: "INR" };
}
