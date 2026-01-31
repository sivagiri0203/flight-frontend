export default function FlightCard({ flight, onSelect }) {
  const f = flight;

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-bold text-slate-900">
            {f?.airline?.name || "Airline"} • {f?.flight?.iata || f?.flight?.number || "N/A"}
          </div>
          <div className="text-sm text-slate-600 mt-1">
            {f?.departure?.iata || "??"} ({f?.departure?.airport || "Departure"}) →{" "}
            {f?.arrival?.iata || "??"} ({f?.arrival?.airport || "Arrival"})
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Status: <span className="font-semibold">{f?.flight_status || "unknown"}</span>
          </div>
        </div>

        <button
          onClick={() => onSelect(f)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-800"
        >
          Select
        </button>
      </div>
    </div>
  );
}
