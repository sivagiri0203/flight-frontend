export default function AddOns({ addOns, setAddOns }) {
  return (
    <div className="space-y-4">
      <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer">
        <div>
          <div className="font-semibold">Extra Legroom</div>
          <div className="text-sm text-slate-500">₹799</div>
        </div>
        <input
          type="checkbox"
          checked={addOns.extraLegroom}
          onChange={(e) =>
            setAddOns({ ...addOns, extraLegroom: e.target.checked })
          }
        />
      </label>

      <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer">
        <div>
          <div className="font-semibold">Extra Luggage (15kg)</div>
          <div className="text-sm text-slate-500">₹999</div>
        </div>
        <input
          type="checkbox"
          checked={addOns.extraLuggage}
          onChange={(e) =>
            setAddOns({ ...addOns, extraLuggage: e.target.checked })
          }
        />
      </label>
    </div>
  );
}