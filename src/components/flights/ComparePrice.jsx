export default function ComparePrice({ flightsWithPrice, cabin }) {
  if (!flightsWithPrice?.length) return null;

  const sorted = [...flightsWithPrice].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0]?.price;

  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-extrabold text-slate-900">
          Compare Price ({cabin.toUpperCase()})
        </h3>
        <span className="text-sm text-slate-600">
          Cheapest: <b className="text-green-600">₹{cheapest}</b>
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {sorted.map((f, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-3 rounded-xl border ${
              f.price === cheapest
                ? "bg-green-50 border-green-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <div className="font-bold text-slate-900">{f.airline}</div>
              <div className="text-xs text-slate-600">{f.flightNo}</div>
            </div>
            <div className="text-lg font-extrabold text-slate-900">₹{f.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
