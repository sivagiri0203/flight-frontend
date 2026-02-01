import { generateItineraryPDF } from "../utils/itineraryPdf";
import { printItinerary } from "../utils/printItinerary";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { bookingById, cancelBooking } from "../services/booking.service";
import Loader from "../components/common/Loader";

function Badge({ type, children }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border";
  const styles = {
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return <span className={`${base} ${styles[type] || styles.slate}`}>{children}</span>;
}

export default function BookingDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [err, setErr] = useState("");
  const [canceling, setCanceling] = useState(false);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await bookingById(id);
      setBooking(res.data.booking);
    } catch (e) {
      console.error("Load booking error:", e?.response?.data || e);
      setErr(e?.response?.data?.message || "Failed to load booking");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onCancel() {
    if (!booking) return;

    if (booking.bookingStatus === "cancelled") {
      alert("Already cancelled");
      return;
    }

    // optional: block cancelling paid bookings (only if your backend has refund flow)
    // if (booking.paymentStatus === "paid") {
    //   alert("This booking is already paid. Implement refund flow before cancelling.");
    //   return;
    // }

    if (!confirm("Cancel this booking?")) return;

    setCanceling(true);
    try {
      const res = await cancelBooking(id);
      alert(res?.message || "Booking cancelled ✅");

      // ✅ Refresh booking
      await load();
    } catch (e) {
      console.error("Cancel error:", e?.response?.data || e);
      alert(e?.response?.data?.message || "Cancel failed");
    } finally {
      setCanceling(false);
    }
  }

  if (loading) return <Loader />;
  if (err) return <div className="max-w-6xl mx-auto px-4 py-10 text-red-700">{err}</div>;
  if (!booking) return null;

  const isCancelled = booking.bookingStatus === "cancelled";
  const isPaid = booking.paymentStatus === "paid";

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Booking Details</h1>
            <p className="text-slate-600 mt-1">PNR: {booking.pnr}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge type={isPaid ? "green" : "amber"}>
                Payment: {booking.paymentStatus}
              </Badge>
              <Badge type={isCancelled ? "red" : "green"}>
                Booking: {booking.bookingStatus}
              </Badge>
            </div>
          </div>

          {/* ✅ Only show checkout if not cancelled and not paid */}
          {!isCancelled && !isPaid && (
            <Link
              to={`/checkout/${booking._id}`}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-800 w-fit"
            >
              Pay / Checkout
            </Link>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border rounded-2xl p-5">
            <div className="font-bold text-slate-900">Flight</div>
            <div className="text-sm text-slate-700 mt-2">
              {booking.flight.depIata} → {booking.flight.arrIata}
            </div>
            <div className="text-sm text-slate-700">
              {booking.flight.flightIata || booking.flight.flightNumber} •{" "}
              {booking.flight.airlineName}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Status: {booking.flight.status}
            </div>
          </div>

          <div className="bg-slate-50 border rounded-2xl p-5">
            <div className="font-bold text-slate-900">Payment</div>
            <div className="text-sm text-slate-700 mt-2">
              Amount: ₹{booking.amount} • {booking.currency}
            </div>
            <div className="text-sm text-slate-700">
              Payment status: <b>{booking.paymentStatus}</b>
            </div>
            <div className="text-sm text-slate-700">
              Booking status: <b>{booking.bookingStatus}</b>
            </div>
          </div>
        </div>

   {/* ✅ Actions */}
<div className="mt-6 flex flex-col md:flex-row gap-3">
  <button
    onClick={() => generateItineraryPDF(booking)}
    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700"
  >
    Download PDF
  </button>

  <button
    onClick={() => printItinerary(booking)}
    className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-800"
  >
    Print Ticket
  </button>

  <button
    onClick={onCancel}
    disabled={canceling || isCancelled}
    className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {isCancelled ? "Booking Cancelled" : canceling ? "Cancelling..." : "Cancel Booking"}
  </button>
</div>

      </div>
    </section>
    
  );
}
