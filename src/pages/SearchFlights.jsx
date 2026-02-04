import ComparePrice from "../components/flights/ComparePrice";
import { buildCabinPrices } from "../utils/priceEngine";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createBooking } from "../services/booking.service";
import FlightSearchForm from "../components/flights/FlightSearchForm";
import FlightCard from "../components/flights/FlightCard";
import Loader from "../components/common/Loader";
import BookingOptionsModal from "../components/flights/BookingOptionsModal";
import { searchAmadeusOffers } from "../services/amadeus.service";

function normalizeDate(dateStr) {
  if (!dateStr) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return undefined;
}

function cabinToAmadeus(cabin) {
  const map = {
    economy: "ECONOMY",
    premium: "PREMIUM_ECONOMY",
    business: "BUSINESS",
    first: "FIRST",
  };
  return map[cabin] || "ECONOMY";
}

// Convert Amadeus offer -> your FlightCard format (airline/flight/departure/arrival)
function offerToFlight(offer) {
  const itinerary = offer?.itineraries?.[0];
  const seg = itinerary?.segments?.[0];
  const lastSeg = itinerary?.segments?.[itinerary?.segments?.length - 1];

  const carrier = seg?.carrierCode;
  const flightNo = seg?.number ? `${carrier}${seg.number}` : carrier;

  return {
    provider: "amadeus",
    offerId: offer?.id,
    price: offer?.price,
    rawOffer: offer,

    airline: { name: carrier || "Airline", iata: carrier },
    flight: { iata: flightNo, number: seg?.number },

    departure: {
      iata: seg?.departure?.iataCode,
      airport: seg?.departure?.iataCode,
      scheduled: seg?.departure?.at,
    },

    arrival: {
      iata: lastSeg?.arrival?.iataCode,
      airport: lastSeg?.arrival?.iataCode,
      scheduled: lastSeg?.arrival?.at,
    },

    flight_status: "offer",
  };
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
  const [info, setInfo] = useState("");

  const [showCompare, setShowCompare] = useState(false);
  const [cabin, setCabin] = useState("economy");

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [openOptions, setOpenOptions] = useState(false);

  async function onSearch(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setLoading(true);

    try {
      const origin = form.depIata.trim().toUpperCase();
      const destination = form.arrIata.trim().toUpperCase();
      const date = normalizeDate(form.date);

      if (!date) {
        setErr("Date is required for Amadeus search (YYYY-MM-DD).");
        setResults([]);
        setLoading(false);
        return;
      }

      const res = await searchAmadeusOffers({
        origin,
        destination,
        date,
        adults: Number(form.passengers || 1),
        travelClass: cabinToAmadeus(cabin),
        max: Number(form.limit || 20),
      });

      const offers = res?.data?.offers || [];
      const flights = offers.map(offerToFlight);

      setResults(flights);

      if (flights.length === 0) {
        setInfo("No flight offers found. Try different date/route.");
      } else {
        setInfo("✅ Real price offers from Amadeus loaded.");
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Amadeus search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function onSelect(flight) {
    if (!user) return nav("/login");
    setSelectedFlight(flight);
    setOpenOptions(true);
  }

  async function onConfirmBooking({ flight, seats, addons, amount }) {
    const passengerCount = Number(form.passengers || 1);

    const passengersArray = Array.from({ length: passengerCount }, (_, i) => ({
      fullName: `${user?.name || "Passenger"} ${i + 1}`,
      age: 22,
      gender: "male",
    }));

    // If flight came from Amadeus, keep the offerId + price raw
    const payload = {
      flight: {
        ...flight,
        selectedDate: normalizeDate(form.date) || null,
      },
      passengers: passengersArray,
      seats,
      cabinClass: cabin,
      amount, // from modal (base + addons)
      addons, // safe if backend ignores
    };

    try {
      const res = await createBooking(payload);
      setOpenOptions(false);
      setSelectedFlight(null);
      nav(`/checkout/${res.data.booking._id}`);
    } catch (e) {
      alert(e?.response?.data?.message || "Booking failed");
    }
  }

  // Compare rows works even with Amadeus (airline code is f.airline.iata)
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
        airline: f?.airline?.name || airlineIata,
        flightNo: f?.flight?.iata || f?.flight?.number || "N/A",
        price,
      };
    });
  }, [results, cabin, form.depIata, form.arrIata, form.date]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-slate-900">Search Flights</h1>
        <p className="text-slate-600 mt-1">Amadeus requires Date. Use IATA codes like MAA → DEL</p>

        <div className="mt-6">
          <FlightSearchForm
            form={form}
            setForm={setForm}
            onSearch={onSearch}
            loading={loading}
          />
        </div>

        {info && (
          <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-lg">
            {info}
          </div>
        )}

        {err && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">{err}</div>
        )}

        <div className="mt-6 space-y-4">
          {loading && <Loader label="Fetching offers..." />}

          {!loading && results.length === 0 && (
            <div className="text-sm text-slate-600">No results. Try searching.</div>
          )}

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

          {!loading &&
            results.map((f, idx) => (
              <FlightCard key={idx} flight={f} onSelect={onSelect} />
            ))}
        </div>
      </div>

      <BookingOptionsModal
        open={openOptions}
        onClose={() => setOpenOptions(false)}
        passengerCount={Number(form.passengers || 1)}
        baseFare={4999}
        flight={selectedFlight}
        onConfirm={onConfirmBooking}
      />
    </section>
  );
}