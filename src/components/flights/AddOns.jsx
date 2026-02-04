import { useEffect, useMemo, useState } from "react";

const ADDONS = [
  { key: "legroom", name: "Extra Legroom", price: 799 },
  { key: "luggage15", name: "Extra Luggage (15kg)", price: 999 },
  { key: "luggage30", name: "Extra Luggage (30kg)", price: 1499 },
];

export default function AddOns({ value = {}, onChange }) {
  const [selected, setSelected] = useState(value);

  const total = useMemo(() => {
    return ADDONS.reduce((sum, a) => sum + (selected[a.key] ? a.price : 0), 0);
  }, [selected]);

  useEffect(() => {
    const chosen = ADDONS.filter((a) => selected[a.key]);
    onChange?.({ chosen, total, selected });
  }, [selected, total, onChange]);

  return (
    <div className="bg-white border rounded-2xl p-5">
      <h3 className="font-bold text-slate-900">Add-ons</h3>
      <p className="text-sm text-slate-600 mt-1">Choose optional extras</p>

      <div className="mt-4 space-y-3">
        {ADDONS.map((a) => (
          <label
            key={a.key}
            className="flex items-center justify-between gap-3 p-3 border rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!selected[a.key]}
                onChange={(e) => setSelected((p) => ({ ...p, [a.key]: e.target.checked }))}
              />
              <div>
                <div className="font-semibold text-slate-900">{a.name}</div>
                <div className="text-xs text-slate-600">₹{a.price}</div>
              </div>
            </div>
            <div className="font-bold text-slate-900">₹{a.price}</div>
          </label>
        ))}
      </div>

      <div className="mt-4 text-right font-bold text-slate-900">
        Add-ons total: ₹{total}
      </div>
    </div>
  );
}