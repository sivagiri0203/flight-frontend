import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="min-h-[80vh] bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-16 text-white">
        {/* Hero Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/20">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            ✈️TN AIRLINES - Your Gateway to the Skies!
          </h1>

          <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl">
            Search flights, book tickets, pay securely with Razorpay,  
            and manage bookings easily — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/search"
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-6 py-3 rounded-xl font-bold shadow-lg transition"
            >
              🔍 Search Flights
            </Link>

            <Link
              to="/my-bookings"
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold border border-white/30 transition"
            >
              📄 My Bookings
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/15 rounded-2xl p-5 border border-white/20">
              <div className="text-2xl">🌍</div>
              <h3 className="mt-2 font-bold">Live Flight Search</h3>
              <p className="text-sm text-blue-100 mt-1">
                Real-time data using AviationStack API.
              </p>
            </div>

            <div className="bg-white/15 rounded-2xl p-5 border border-white/20">
              <div className="text-2xl">💳</div>
              <h3 className="mt-2 font-bold">Secure Payments</h3>
              <p className="text-sm text-blue-100 mt-1">
                Razorpay-powered safe and fast checkout.
              </p>
            </div>

            <div className="bg-white/15 rounded-2xl p-5 border border-white/20">
              <div className="text-2xl">📊</div>
              <h3 className="mt-2 font-bold">Admin Dashboard</h3>
              <p className="text-sm text-blue-100 mt-1">
                Track users, bookings, and revenue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
