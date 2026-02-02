export default function FlightSearchForm({ form, setForm, onSearch, loading }) {
  return (
    <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
      
      {/* From */}
      <input
        type="text"
        placeholder="From (MAA)"
        value={form.depIata}
        onChange={(e) => setForm({ ...form, depIata: e.target.value })}
        className="border rounded-xl px-3 py-2"
        required
      />

      {/* To */}
      <input
        type="text"
        placeholder="To (DEL)"
        value={form.arrIata}
        onChange={(e) => setForm({ ...form, arrIata: e.target.value })}
        className="border rounded-xl px-3 py-2"
        required
      />

      {/* Date */}
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="border rounded-xl px-3 py-2"
      />

      {/* 👤 Passengers */}
     {/* 👤 Passengers */}
<div className="flex flex-col">
  <label className="text-sm font-semibold text-slate-700 mb-1">
    Passengers
  </label>
  <input
    type="number"
    min="1"
    max="9"
    value={form.passengers || 1}
    onChange={(e) =>
      setForm({ ...form, passengers: Number(e.target.value) })
    }
    className="border rounded-xl px-4 py-3"
  />
</div>


      {/* Search */}
      <button
        type="submit"
        disabled={loading}
        className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-800"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
