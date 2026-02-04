export default function SeatSelector({
  passengers,
  selectedSeats,
  setSelectedSeats,
}) {
  const rows = 12;
  const cols = ["A", "B", "C", "D", "E", "F"];

  function toggleSeat(seat) {
    const exists = selectedSeats.includes(seat);

    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      return;
    }

    if (selectedSeats.length >= passengers) {
      alert(`You can select only ${passengers} seat(s)`);
      return;
    }

    setSelectedSeats([...selectedSeats, seat]);
  }

  return (
    <div className="border rounded-2xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Select Seats</h3>
        <span className="text-sm text-slate-500">
          Pick {passengers}
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: rows }).map((_, r) =>
          cols.map((c) => {
            const seat = `${r + 1}${c}`;
            const active = selectedSeats.includes(seat);

            return (
              <button
                key={seat}
                onClick={() => toggleSeat(seat)}
                className={`border rounded-lg py-2 text-sm font-semibold ${
                  active ? "bg-slate-900 text-white" : "bg-white"
                }`}
              >
                {seat}
              </button>
            );
          })
        )}
      </div>

      <div className="mt-4 text-sm text-slate-600">
        Selected: {selectedSeats.join(", ") || "None"}
      </div>
    </div>
  );
}