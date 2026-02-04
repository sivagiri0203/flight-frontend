export default function FlightSearchForm({ form, setForm, onSearch, loading }) {
  const dateRequired = true; // ✅ Amadeus requires date

  return (
    <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {/* From */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">From (IATA)</label>
        <input
          type="text"
          placeholder="MAA"
          value={form.depIata}
          onChange={(e) => setForm({ ...form, depIata: e.target.value })}
          className="border rounded-xl px-3 py-2"
          maxLength={3}
          required
        />
        <p className="text-xs text-slate-500 mt-1">Example: MAA</p>
      </div>

      {/* To */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">To (IATA)</label>
        <input
          type="text"
          placeholder="DEL"
          value={form.arrIata}
          onChange={(e) => setForm({ ...form, arrIata: e.target.value })}
          className="border rounded-xl px-3 py-2"
          maxLength={3}
          required
        />
        <p className="text-xs text-slate-500 mt-1">Example: DEL</p>
      </div>

      {/* Date */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">
          Travel Date {dateRequired ? <span className="text-red-600">*</span> : null}
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border rounded-xl px-3 py-2"
          required={dateRequired}
        />
        <p className="text-xs text-slate-500 mt-1">Amadeus needs date</p>
      </div>

      {/* Passengers */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">Passengers</label>
        <input
          type="number"
          min="1"
          max="9"
          value={form.passengers || 1}
          onChange={(e) => setForm({ ...form, passengers: Number(e.target.value) })}
          className="border rounded-xl px-3 py-2"
          required
        />
        <p className="text-xs text-slate-500 mt-1">1 to 9</p>
      </div>

      {/* Limit */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">Results</label>
        <select
          value={form.limit || 20}
          onChange={(e) => setForm({ ...form, limit: Number(e.target.value) })}
          className="border rounded-xl px-3 py-2 bg-white"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
        <p className="text-xs text-slate-500 mt-1">Max offers</p>
      </div>

      {/* Search Button */}
      <div className="flex flex-col justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
