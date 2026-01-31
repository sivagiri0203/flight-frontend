import { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { getAnalytics } from "../services/admin.service";

function Stat({ label, value }) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-2xl font-bold text-slate-900 mt-2">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getAnalytics();
        setData(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader label="Loading analytics..." />;
  if (err) return <div className="max-w-6xl mx-auto px-4 py-10 text-red-700">{err}</div>;
  if (!data) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat label="Users" value={data.users} />
        <Stat label="Bookings" value={data.bookings} />
        <Stat label="Payments Paid" value={data.paymentsPaid} />
        <Stat label="Revenue (₹)" value={data.revenue} />
      </div>

      <div className="mt-8 bg-white border rounded-2xl shadow p-6">
        <h2 className="text-lg font-bold text-slate-900">Recent bookings</h2>
        <div className="mt-4 space-y-3">
          {(data.recentBookings || []).map((b) => (
            <div key={b._id} className="bg-slate-50 border rounded-xl p-4">
              <div className="font-semibold text-slate-900">PNR: {b.pnr}</div>
              <div className="text-sm text-slate-600">
                {b.flight.depIata} → {b.flight.arrIata} • {b.paymentStatus}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
