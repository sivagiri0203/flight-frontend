import { useEffect, useMemo, useState } from "react";

const COLS = ["A", "B", "C", "D", "E", "F"];
const MOCK_BOOKED = new Set(["1A", "1B", "2C", "3D", "4F", "6A", "8C"]);

function genSeats(rows = 12) {
  const arr = [];
  for (let r = 1; r <= rows; r++) for (const c of COLS) arr.push(`${r}${c}`);
  return arr;
}

export default function BookingOptionsModal({
  open,
  onClose,
  passengerCount = 1,
  baseFare = 4999,
  flight,
  onConfirm,
}) {
  const seats = useMemo(() => genSeats(12), []);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [addons, setAddons] = useState({
    legroom: false,
    luggage15: false,
  });

  useEffect(() => {
    // reset when modal opens
    if (open) {
      setSelectedSeats([]);
      setAddons({ legroom: false, luggage15: false });
    }
  }, [open]);

  const addonsTotal =
    (addons.legroom ? 799 : 0) + (addons.luggage15 ? 999 : 0);

  const total = baseFare * passengerCount + addonsTotal;

  function toggleSeat(seat) {
    if (MOCK_BOOKED.has(seat)) return;

    setSelectedSeats((prev) => {
      let next = prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat];

      if (next.length > passengerCount) next = next.slice(0, passengerCount);
      return next;
    });
  }

  function confirm() {
    if (selectedSeats.length < passengerCount) {
      alert(`Please select ${passengerCount} seat(s).`);
      return;
    }

    onConfirm({
      flight,
      seats: selectedSeats,
      addons,
      amount: total,
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border overflow-hidden">
        <div className="p-5 border-b flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Seats & Add-ons
            </h3>
            <p className="text-sm text-slate-600">
              {flight?.airline?.name || "Airline"} •{" "}
              {flight?.flight?.iata || flight?.flight?.number || "N/A"} •{" "}
              {flight?.departure?.iata || "??"} → {flight?.arrival?.iata || "??"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border font-semibold hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Seats */}
          <div className="border rounded-2xl p-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900">Select Seats</div>
              <div className="text-xs text-slate-600">
                Pick {passengerCount}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-6 gap-2">
              {seats.map((seat) => {
                const booked = MOCK_BOOKED.has(seat);
                const selected = selectedSeats.includes(seat);

                const cls = booked
                  ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed"
                  : selected
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-900 border-slate-300 hover:bg-slate-100";

                return (
                  <button
                    key={seat}
                    type="button"
                    disabled={booked}
                    onClick={() => toggleSeat(seat)}
                    className={`w-10 h-10 rounded-lg border text-sm font-bold ${cls}`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-sm text-slate-700">
              Selected:{" "}
              <b>{selectedSeats.length ? selectedSeats.join(", ") : "None"}</b>
            </div>
          </div>

          {/* Add-ons */}
          <div className="border rounded-2xl p-4">
            <div className="font-bold text-slate-900">Add-ons</div>

            <label className="mt-3 flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={addons.legroom}
                  onChange={(e) =>
                    setAddons((p) => ({ ...p, legroom: e.target.checked }))
                  }
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    Extra Legroom
                  </div>
                  <div className="text-xs text-slate-600">₹799</div>
                </div>
              </div>
              <div className="font-bold">₹799</div>
            </label>

            <label className="mt-3 flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={addons.luggage15}
                  onChange={(e) =>
                    setAddons((p) => ({ ...p, luggage15: e.target.checked }))
                  }
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    Extra Luggage (15kg)
                  </div>
                  <div className="text-xs text-slate-600">₹999</div>
                </div>
              </div>
              <div className="font-bold">₹999</div>
            </label>

            <div className="mt-5 p-3 bg-slate-50 rounded-xl text-sm">
              <div className="flex justify-between">
                <span>Base fare</span>
                <b>₹{baseFare} × {passengerCount}</b>
              </div>
              <div className="flex justify-between mt-1">
                <span>Add-ons</span>
                <b>₹{addonsTotal}</b>
              </div>
              <div className="flex justify-between mt-2 text-base">
                <span>Total</span>
                <b>₹{total}</b>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}