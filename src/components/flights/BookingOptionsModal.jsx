import SeatSelector from "./SeatSelector";
import AddOns from "./AddOns";

export default function BookingOptionsModal({
  open,
  onClose,
  passengers,
  selectedSeats,
  setSelectedSeats,
  addOns,
  setAddOns,
  totalAmount,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Seats & Add-ons</h2>
          <button
            className="text-slate-600 hover:text-slate-900"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Seat Selector */}
          <SeatSelector
            passengers={passengers}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
          />

          {/* Right: Add-ons + price */}
          <div>
            <AddOns addOns={addOns} setAddOns={setAddOns} />

            <div className="mt-6 bg-slate-50 border rounded-xl p-4">
              <div className="flex justify-between">
                <span>Base fare</span>
                <span>₹4999 x {passengers}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Add-ons</span>
                <span>
                  ₹{(addOns.extraLegroom ? 799 : 0) + (addOns.extraLuggage ? 999 : 0)}
                </span>
              </div>
              <div className="flex justify-between font-bold mt-3 text-lg">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* ✅ Buttons */}
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border font-semibold"
              >
                Back
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}