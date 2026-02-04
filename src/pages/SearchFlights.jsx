import ComparePrice from "../components/flights/ComparePrice";
import { buildCabinPrices } from "../utils/priceEngine";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { searchFlights } from "../services/flight.service";
import { createBooking } from "../services/booking.service";
import FlightSearchForm from "../components/flights/FlightSearchForm";
import FlightCard from "../components/flights/FlightCard";
import Loader from "../components/common/Loader";

function normalizeDate(dateStr) {
  if (!dateStr) return undefined;

  // Already correct: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // Convert: DD-MM-YYYY -> YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  // fallback
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);

  return undefined;
}





export default function SearchFlights() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    depIata: "MAA",
    arrIata: "DEL",
    date: "",
    limit: 20,
    passengers: 1,
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [showCompare, setShowCompare] = useState(false);
  const [cabin, setCabin] = useState("economy");

  async function onSearch(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await searchFlights({
        depIata: form.depIata.trim().toUpperCase(),
        arrIata: form.arrIata.trim().toUpperCase(),
        date: normalizeDate(form.date),
        limit: form.limit || 20,
      });
      setResults(res.data.results || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }
async function onSelect(flight) {
  if (!user) return nav("/login");

  // create passengers array based on count
  const passengersArray = Array.from(
    { length: form.passengers },
    (_, i) => ({
      fullName: `${user.name || "Passenger"} ${i + 1}`,
      age: 22,
      gender: "male",
    })
  );

  const payload = {
    flight,
    passengers: passengersArray,
    seats: [],
    cabinClass: cabin,
    amount: 4999 * form.passengers, // simple price calc
  };

  try {
    const res = await createBooking(payload);
    nav(`/checkout/${res.data.booking._id}`);
  } catch (e) {
    alert(e?.response?.data?.message || "Booking failed");
  }
}



  // ✅ FIX: define compareRows
  const compareRows = useMemo(() => {
    return (results || []).map((f) => {
      const airlineIata = f?.airline?.iata || "DEFAULT";
      const depIata = f?.departure?.iata || form.depIata;
      const arrIata = f?.arrival?.iata || form.arrIata;

      const pricing = buildCabinPrices({
        airlineIata,
        depIata,
        arrIata,
        date: normalizeDate(form.date),

      });

      const selected = pricing.cabins.find((c) => c.class === cabin);
      const price = selected?.price || pricing.minPrice;

      return {
        airline: f?.airline?.name || "Unknown",
        flightNo: f?.flight?.iata || f?.flight?.number || "N/A",
        price,
      };
    });
  }, [results, cabin, form.depIata, form.arrIata, form.date]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-slate-900">Search Flights</h1>
        <p className="text-slate-600 mt-1">Use IATA codes like MAA → DEL</p>

        <div className="mt-6">
          <FlightSearchForm form={form} setForm={setForm} onSearch={onSearch} loading={loading} />
        </div>

        {err && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">{err}</div>
        )}

        <div className="mt-6 space-y-4">
          {loading && <Loader label="Fetching flights..." />}

          {!loading && results.length === 0 && (
            <div className="text-sm text-slate-600">No results. keep Try searching.</div>
          )}

          {/* ✅ Compare Button */}
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
                  <option value="first">First class</option>
                </select>
              </div>

              {showCompare && <ComparePrice rows={compareRows} />}
            </>
          )}

          {/* Flight list */}
          {!loading && results.map((f, idx) => (
            <FlightCard key={idx} flight={f} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}