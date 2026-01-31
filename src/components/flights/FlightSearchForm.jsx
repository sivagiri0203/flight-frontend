export default function FlightSearchForm({ form, setForm, onSearch, loading }) {
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-6 gap-3">
      <div className="md:col-span-1">
        <label className="text-sm font-medium text-slate-700">From (IATA)</label>
        <input
          name="depIata"
          value={form.depIata}
          onChange={onChange}
          className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
          placeholder="MAA"
        />
      </div>

      <div className="md:col-span-1">
        <label className="text-sm font-medium text-slate-700">To (IATA)</label>
        <input
          name="arrIata"
          value={form.arrIata}
          onChange={onChange}
          className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
          placeholder="DEL"
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-medium text-slate-700">Date (optional)</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={onChange}
          className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
        />
      </div>

      <div className="md:col-span-1">
        <label className="text-sm font-medium text-slate-700">Limit</label>
        <input
          name="limit"
          value={form.limit}
          onChange={onChange}
          className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
          placeholder="20"
        />
      </div>

      <div className="md:col-span-1 flex items-end">
        <button
          disabled={loading}
          className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
