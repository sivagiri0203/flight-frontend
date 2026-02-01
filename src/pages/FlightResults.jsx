import { useMemo, useState } from "react";
import ComparePrice from "../components/flights/ComparePrice";
import { buildCabinPrices } from "../utils/priceEngine";
// ... your other imports

export default function FlightResultsOrSearchPage() {
  // ✅ you already have results in state like:
  // const [results, setResults] = useState([]);

  const [compareOpen, setCompareOpen] = useState(false);
  const [cabin, setCabin] = useState("economy");

  // ✅ Convert your existing results into compare-friendly format
  const flightsWithPrice = useMemo(() => {
    return (results || []).map((f) => {
      const airlineIata = f?.airline?.iata || "DEFAULT";
      const depIata = f?.departure?.iata;
      const arrIata = f?.arrival?.iata;

      const pricing = buildCabinPrices({
        airlineIata,
        depIata,
        arrIata,
        date: form?.date, // if you have form date
      });

      const price = pricing.cabins.find((c) => c.class === cabin)?.price || pricing.minPrice;

      return {
        airline: f?.airline?.name || "Unknown",
        flightNo: f?.flight?.iata || f?.flight?.number || "N/A",
        price,
      };
    });
  }, [results, cabin, form?.date]);

  return (
    <div>
      {/* ✅ Add this button ABOVE your flight cards list */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button
          onClick={() => setCompareOpen((s) => !s)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-800"
        >
          {compareOpen ? "Hide Compare" : "Compare Price"}
        </button>

        <select
          value={cabin}
          onChange={(e) => setCabin(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 bg-white"
        >
          <option value="economy">Economy</option>
          <option value="premium">Premium</option>
          <option value="business">Business</option>
          <option value="first">First</option>
        </select>
      </div>

      {/* ✅ Compare section */}
      {compareOpen && <ComparePrice flightsWithPrice={flightsWithPrice} cabin={cabin} />}

      {/* ✅ Your existing results list stays same */}
      <div className="mt-6 space-y-4">
        {results.map((flight, idx) => (
          <FlightCard key={idx} flight={flight} />
        ))}
      </div>
    </div>
  );
}
