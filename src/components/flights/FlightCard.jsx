export default function FlightCard({ flight, onSelect }) {
  const f = flight;

  const airlineName = f?.airline?.name || f?.airline?.iata || "Airline";
  const flightNo = f?.flight?.iata || f?.flight?.number || "N/A";

  const depIata = f?.departure?.iata || "??";
  const arrIata = f?.arrival?.iata || "??";

  const depAirport = f?.departure?.airport || depIata;
  const arrAirport = f?.arrival?.airport || arrIata;

  const depTime = f?.departure?.scheduled || f?.departure?.at || "";
  const arrTime = f?.arrival?.scheduled || f?.arrival?.at || "";

  const status = f?.flight_status || f?.flight_status?.status || "unknown";

  const priceCurrency = f?.price?.currency || "INR";
  const priceTotal = f?.price?.total || null;

  // If you added selectedDate in SearchFlights, show it
  const date = f?.flight_date || f?.selectedDate || "";

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* LEFT */}
        <div className="min-w-0">
          <div className="text-lg font-bold text-slate-900 truncate">
            {airlineName} • {flightNo}
          </div>

          <div className="text-sm text-slate-600 mt-1">
            <span className="font-semibold text-slate-800">{depIata}</span>{" "}
            <span className="text-slate-500">({depAirport})</span>{" "}
            <span className="mx-1">→</span>{" "}
            <span className="font-semibold text-slate-800">{arrIata}</span>{" "}
            <span className="text-slate-500">({arrAirport})</span>
          </div>

          {(depTime || arrTime) && (
            <div className="text-xs text-slate-500 mt-2">
              {depTime ? (
                <>
                  Depart: <span className="font-semibold">{depTime}</span>
                </>
              ) : null}
              {depTime && arrTime ? <span className="mx-2">•</span> : null}
              {arrTime ? (
                <>
                  Arrive: <span className="font-semibold">{arrTime}</span>
                </>
              ) : null}
            </div>
          )}

          <div className="text-xs text-slate-500 mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full border bg-slate-50 text-slate-700">
              Status: <span className="ml-1 font-semibold">{status}</span>
            </span>

            {date ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full border bg-slate-50 text-slate-700">
                Date: <span className="ml-1 font-semibold">{date}</span>
              </span>
            ) : null}

            {f?.provider ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full border bg-slate-50 text-slate-700">
                Provider: <span className="ml-1 font-semibold">{f.provider}</span>
              </span>
            ) : null}
          </div>

          {/* PRICE (Amadeus offers) */}
          {priceTotal ? (
            <div className="mt-3 text-sm">
              <span className="text-slate-600">Total Price:</span>{" "}
              <span className="font-extrabold text-slate-900">
                {priceCurrency} {priceTotal}
              </span>
            </div>
          ) : (
            <div className="mt-3 text-sm text-slate-500">
              Price not available
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-stretch md:items-end gap-2">
          <button
            onClick={() => onSelect(f)}
            className="bg-slate-900 text-white px-5 py-2 rounded-xl font-semibold hover:bg-slate-800 transition"
          >
            Select
          </button>

          <div className="text-xs text-slate-500 text-right">
            Choose seats & add-ons in next step
          </div>
        </div>
      </div>
    </div>
  );
}
