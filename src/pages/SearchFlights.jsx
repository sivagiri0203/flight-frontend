import ComparePrice from "../components/flights/ComparePrice";
import { buildCabinPrices } from "../utils/priceEngine";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { searchFlights } from "../services/flight.service"; // ✅ make sure this calls Amadeus endpoint
import { createBooking } from "../services/booking.service";
import FlightSearchForm from "../components/flights/FlightSearchForm";
import FlightCard from "../components/flights/FlightCard";
import Loader from "../components/common/Loader";

export default function SearchFlights() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    depIata: "MAA",
    arrIata: "DEL",
    date: "", // ✅ input[type=date] gives YYYY-MM-DD
    limit: 20,
    passengers: 1,
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [showCompare, setShowCompare] = useState(false);
  const [cabin, setCabin] = useState("economy");

  // ✅ Amadeus requires date — don’t convert it. Use 그대로 YYYY-MM-DD.
  async function onSearch(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const depIata = form.depIata.trim().toUpperCase();
    const arrIata = form.arrIata.trim().toUpperCase();

    try {
      const res = await searchFlights({
        depIata,
        arrIata,
        date: form.date || undefined, // ✅ keep YYYY-MM-DD
        limit: form.limit || 20,
        passengers: form.passengers || 1, // ✅ send passengers too
      });

      const list = res?.data?.results || res?.data?.data || [];
      setResults(Array.isArray(list) ? list : []);
      if (!list?.length) setErr("No flight offers found. Try different date/route.");
    } catch (e2) {
      console.error("Search error:", e2?.response?.data || e2);
      setErr(e2?.response?.data?.message || "Flight search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Create booking from selected flight
  async function onSelect(flight) {
    if (!user) return nav("/login");

    const count = Number(form.passengers || 1);

    const passengersArray = Array.from({ length: count }, (_, i) => ({
      fullName: `${user.name || "Passenger"} ${i + 1}`,
      age: 22,
      gender: "male",
    }));

    // ✅ simple amount calc — you can replace with Amadeus price later
    const amountPerPerson = 4999;

    const payload = {
      flight,
      passengers: passengersArray,
      seats: [],
      cabinClass: cabin,
      amount: amountPerPerson * count,
      travelDate: form.date, // ✅ helpful for itinerary UI (backend ignores if not used)
    };

    try {
      const res = await createBooking(payload);
      nav(`/checkout/${res.data.booking._id}`);
    } catch (e3) {
      console.error("Booking error:", e3?.response?.data || e3);
      alert(e3?.response?.data?.message || "Booking failed");
    }
  }

  // ✅ Compare rows (dummy pricing engine)
  const compareRows = useMemo(() => {
    const dep = form.depIata.trim().toUpperCase();
    const arr = form.arrIata.trim().toUpperCase();

    return (results || []).map((f) => {
      const airlineIata = f?.airline?.iata || f?.airlineCode || "DEFAULT";
      const depIata = f?.departure?.iata || dep;
      const arrIata = f?.arrival?.iata || arr;

      const pricing = buildCabinPrices({
        airlineIata,
        depIata,
        arrIata,
        date: form.date, // ✅ keep YYYY-MM-DD
      });

      const selected = pricing.cabins.find((c) => c.class === cabin);
      const price = selected?.price || pricing.minPrice;

      return {
        airline: f?.airline?.name || f?.airlineName || "Unknown",
        flightNo:
          f?.flight?.iata ||
          f?.flight?.number ||
          f?.flightNumber ||
          f?.id ||
          "N/A",
        price,
      };
    });
  }, [results, cabin, form.depIata, form.arrIata, form.date]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-slate-900">Search Flights</h1>
        <p className="text-slate-600 mt-1">
          Amadeus requires Date. Use IATA codes like MAA → DEL
        </p>

        <div className="mt-6">
          <FlightSearchForm
            form={form}
            setForm={setForm}
            onSearch={onSearch}
            loading={loading}
          />
        </div>

        {err && (
          <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-lg">
            {err}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {loading && <Loader label="Fetching flights..." />}

          {!loading && results.length === 0 && (
            <div className="text-sm text-slate-600">No results. Try searching.</div>
          )}

          {/* ✅ Compare Price */}
          {!loading && results.length > 0 && (
            <>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCompare((s) => !s)}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-800"
                >
                  {showCompare ? "Hide Compare Price" : "Compare Price"}
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

              {showCompare && <ComparePrice rows={compareRows} />}
            </>
          )}

          {/* ✅ Flight list */}
          {!loading &&
            results.map((f, idx) => (
              <FlightCard key={idx} flight={f} onSelect={onSelect} />
            ))}
        </div>
      </div>
    </section>
  );
}