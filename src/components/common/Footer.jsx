export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600">
        © {new Date().getFullYear()} FlyBook — Flight Booking System
      </div>
    </footer>
  );
}
