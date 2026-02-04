import { useMemo, useState } from "react";

const COLS = ["A", "B", "C", "D", "E", "F"];

// Mock booked seats (later you can make it dynamic)
const MOCK_BOOKED = new Set(["1A", "1B", "2C", "3D", "4F", "6A", "8C"]);

function generateSeats(rows = 12) {
  const seats = [];
  for (let r = 1; r <= rows; r++) {
    for (const c of COLS) seats.push(`${r}${c}`);
  }
  return seats;
}

export default function SeatSelector({ passengerCount = 1, value = [], onChange }) {
  const allSeats = useMemo(() => generateSeats(12), []);
  const [selected, setSelected] = useState(value);

  function toggleSeat(seat) {
    if (MOCK_BOOKED.has(seat)) return;

    setSelected((prev) => {
      let next = prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat];

      // Limit selection by passengerCount
      if (next.length > passengerCount) next = next.slice(0, passengerCount);

      onChange?.(next);
      return next;
    });
  }

  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">Select Seats</h3>
          <p className="text-sm text-slate-600">
            Select up to <b>{passengerCount}</b> seat(s)
          </p>
        </div>

        <div className="text-xs text-slate-600 space-x-3">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-white border border-slate-300" /> Available
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-slate-900" /> Selected
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-slate-200" /> Booked
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-6 gap-2 max-w-md">
        {allSeats.map((seat) => {
          const booked = MOCK_BOOKED.has(seat);
          const isSelected = selected.includes(seat);

          const cls = booked
            ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed"
            : isSelected
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50";

          return (
            <button
              key={seat}
              type="button"
              disabled={booked}
              onClick={() => toggleSeat(seat)}
              className={`w-10 h-10 rounded-lg border text-sm font-bold flex items-center justify-center transition ${cls}`}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-slate-700">
        Selected: <b>{selected.length ? selected.join(", ") : "None"}</b>
      </div>
    </div>
  );
}