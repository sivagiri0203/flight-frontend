import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { myBookings } from "../services/booking.service";
import Loader from "../components/common/Loader";

export default function MyBookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await myBookings();
        setBookings(res.data.bookings || []);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>

        {loading && <Loader />}
        {err && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">{err}</div>}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => (
            <Link
              key={b._id}
              to={`/booking/${b._id}`}
              className="bg-slate-50 border rounded-2xl p-5 hover:bg-slate-100 transition"
            >
              <div className="font-bold text-slate-900">PNR: {b.pnr}</div>
              <div className="text-sm text-slate-600 mt-1">
                {b.flight.depIata} → {b.flight.arrIata} •{" "}
                {b.flight.flightIata || b.flight.flightNumber}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Payment: <b>{b.paymentStatus}</b> • Booking: <b>{b.bookingStatus}</b>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
