export default function PriceComparison({ flights, cabinClass }) {
  if (!flights?.length) return null;

  const sorted = [...flights].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0]?.price;

  return (
    <div className="mt-6 bg-white border rounded-2xl p-5 shadow">
      <h3 className="text-lg font-bold text-slate-900 mb-3">
        Price Comparison ({cabinClass})
      </h3>

      <div className="space-y-3">
        {sorted.map((f, idx) => (
          <div
            key={idx}
            className={`flex justify-between items-center p-3 rounded-xl border ${
              f.price === cheapest
                ? "bg-green-50 border-green-300"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <div className="font-semibold">{f.airline}</div>
              <div className="text-xs text-slate-600">{f.flightNo}</div>
            </div>

            <div className="font-bold text-slate-900">
              ₹{f.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
