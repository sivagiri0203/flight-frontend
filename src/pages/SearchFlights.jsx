// src/pages/SearchFlights.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import FlightSearchForm from "../components/flights/FlightSearchForm";
import FlightCard from "../components/flights/FlightCard";
import BookingOptionsModal from "../components/flights/BookingOptionsModal";
import ComparePrice from "../components/flights/ComparePrice";
import Loader from "../components/common/Loader";

import { buildCabinPrices } from "../utils/priceEngine";
import { searchFlights } from "../services/flight.service"; // ✅ this should call your Amadeus endpoint
import { createBooking } from "../services/booking.service";

export default function SearchFlights() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    depIata: "MAA",
    arrIata: "DEL",
    date: "",        // ✅ Amadeus needs YYYY-MM-DD
    limit: 20,
    passengers: 1,
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [showCompare, setShowCompare] = useState(false);
  const [cabin, setCabin] = useState("economy");

  // ✅ modal state for seats + addOns
  const [openModal, setOpenModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [addOns, setAddOns] = useState({
    extraLegroom: false,
    extraLuggageKg: 0,
  });

  async function onSearch(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await searchFlights({
        depIata: form.depIata.trim().toUpperCase(),
        arrIata: form.arrIata.trim().toUpperCase(),
        date: form.date || undefined,          // ✅ keep input[type=date] format
        limit: Number(form.limit || 20),
        passengers: Number(form.passengers || 1),
        cabinClass: cabin, // optional if your backend supports it
      });

      const list = res?.data?.results || [];
      setResults(Array.isArray(list) ? list : []);

      if (!list?.length) {
        setErr("No flight offers found. Try different route/date.");
      }
    } catch (e2) {
      console.error("Search error:", e2?.response?.data || e2);
      setErr(e2?.response?.data?.message || "Flight search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ open seat+addOn modal
  function onSelect(flight) {
    if (!user) return nav("/login");

    setSelectedFlight(flight);
    setSelectedSeats([]);
    setAddOns({ extraLegroom: false, extraLuggageKg: 0 });
    setOpenModal(true);
  }

  // ✅ confirm booking with seats + addOns
  async function confirmBooking() {
    if (!selectedFlight) return;

    const count = Number(form.passengers || 1);

    // Seat validation (optional but recommended)
    if ((selectedSeats || []).length < count) {
      alert(`Please select ${count} seat(s).`);
      return;
    }

    const passengersArray = Array.from({ length: count }, (_, i) => ({
      fullName: `${user?.name || "Passenger"} ${i + 1}`,
      age: 22,
      gender: "male",
    }));

    // Example pricing (change if you have real Amadeus pricing)
    const baseFare = 4999 * count;
    const legroomFee = addOns.extraLegroom ? 499 : 0;
    const luggageFee = (Number(addOns.extraLuggageKg || 0) || 0) * 100;
    const amount = baseFare + legroomFee + luggageFee;

    const payload = {
      flight: selectedFlight,          // ✅ Amadeus offer / mapped object
      passengers: passengersArray,
      seats: selectedSeats,            // ✅ ["2A","2B"]
      cabinClass: cabin,
      amount,
      addOns: {
        extraLegroom: !!addOns.extraLegroom,
        extraLuggageKg: Number(addOns.extraLuggageKg || 0),
      },
      travelDate: form.date, // optional (backend may ignore)
    };

    try {
      const res = await createBooking(payload);
      setOpenModal(false);
      setSelectedFlight(null);
      nav(`/checkout/${res.data.booking._id}`);
    } catch (e3) {
      console.error("Booking error:", e3?.response?.data || e3);
      alert(e3?.response?.data?.message || "Booking failed");
    }
  }

  // ✅ compare pricing table (demo pricing engine)
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
        date: form.date,
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

          {!loading && results.length === 0 && (
            <div className="text-sm text-slate-600">No results. Try searching.</div>
          )}

          {!loading &&
            results.map((f, idx) => (
              <FlightCard key={idx} flight={f} onSelect={onSelect} />
            ))}
        </div>
      </div>

      {/* ✅ seats + add-ons modal */}
      <BookingOptionsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        flight={selectedFlight}
        passengers={Number(form.passengers || 1)}
        cabin={cabin}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        addOns={addOns}
        setAddOns={setAddOns}
        onConfirm={confirmBooking}
      />
    </section>
  );
}
