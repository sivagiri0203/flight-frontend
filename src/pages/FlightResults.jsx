import { useState } from "react";
import PriceComparison from "../components/flights/PriceComparison";
import { comparePrices } from "../utils/comparePrices";

export default function FlightResults({ flights }) {
  const [cabinClass, setCabinClass] = useState("economy");

  const compared = comparePrices(flights, cabinClass);

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      {/* Cabin selector */}
      <div className="flex gap-3 mb-4">
        {["economy", "business", "first"].map((c) => (
          <button
            key={c}
            onClick={() => setCabinClass(c)}
            className={`px-4 py-2 rounded-xl font-semibold ${
              cabinClass === c
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Comparison */}
      <PriceComparison flights={compared} cabinClass={cabinClass} />
    </section>
  );
}
