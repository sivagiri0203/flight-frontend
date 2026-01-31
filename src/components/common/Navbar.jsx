import { Plane } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDrop(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const itemClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-lg text-sm font-semibold transition
     ${isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"}
    `;

  const activeUnderline = ({ isActive }) =>
    isActive ? "after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-slate-900" : "";

  const initials =
    (user?.name?.trim()?.[0] || user?.email?.trim()?.[0] || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-50">
      {/* top glow */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-emerald-500/10 pointer-events-none" />
      <div className="bg-white/75 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 
                flex items-center justify-center shadow-md group-hover:shadow-lg transition">
  <Plane className="h-6 w-6 text-white rotate-45" />
</div>

            <div className="leading-tight">
              <div className="text-lg font-extrabold text-slate-900 tracking-tight">
               TN FlyBook
              </div>
              <div className="text-[11px] text-slate-500 -mt-1">
                Book flights smarter
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/search" className={(p) => itemClass(p) + " " + activeUnderline(p)}>
              Search
            </NavLink>

            {user && (
              <NavLink to="/my-bookings" className={(p) => itemClass(p) + " " + activeUnderline(p)}>
                My Bookings
              </NavLink>
            )}

            {user?.role === "admin" && (
              <NavLink to="/admin" className={(p) => itemClass(p) + " " + activeUnderline(p)}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Quick CTA (desktop) */}
            <button
              onClick={() => nav("/search")}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                         bg-slate-900 text-white hover:bg-slate-800 shadow transition"
            >
              🔎 Search Flights
            </button>

            {!user ? (
              <>
                <button
                  onClick={() => nav("/login")}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => nav("/register")}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white
                             bg-gradient-to-r from-indigo-600 to-sky-500 hover:opacity-95 shadow transition"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="relative" ref={dropRef}>
                {/* Avatar pill */}
                <button
                  onClick={() => setDrop((s) => !s)}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white font-extrabold grid place-items-center">
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <div className="text-sm font-bold text-slate-900 max-w-[140px] truncate">
                      {user?.name || "User"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {user?.role === "admin" ? "Admin" : "Customer"}
                    </div>
                  </div>
                  <span className="text-slate-500">▾</span>
                </button>

                {/* Dropdown */}
                {drop && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                    <div className="p-3 border-b bg-slate-50">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {user?.email}
                      </div>
                      <div className="text-xs text-slate-500">
                        Role: {user?.role}
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          setDrop(false);
                          nav("/my-bookings");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        📄 My Bookings
                      </button>

                      {user?.role === "admin" && (
                        <button
                          onClick={() => {
                            setDrop(false);
                            nav("/admin");
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          📊 Admin Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setDrop(false);
                          logout();
                          nav("/");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold text-slate-900">Menu</div>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <Link
                to="/search"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl bg-slate-900 text-white font-bold"
              >
                🔎 Search Flights
              </Link>

              {user && (
                <Link
                  to="/my-bookings"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl hover:bg-slate-100 font-semibold text-slate-800"
                >
                  📄 My Bookings
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl hover:bg-slate-100 font-semibold text-slate-800"
                >
                  📊 Admin Dashboard
                </Link>
              )}

              {!user ? (
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      nav("/login");
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      nav("/register");
                    }}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                    nav("/");
                  }}
                  className="w-full mt-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
