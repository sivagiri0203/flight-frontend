import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form);
      nav("/search");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-slate-900">Login</h2>
        <p className="text-slate-600 mt-1">Welcome back.</p>

        {err && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">{err}</div>}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="********"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-slate-600">
            New user?{" "}
            <Link className="text-slate-900 font-semibold hover:underline" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
