export default function Loader({ label = "Loading..." }) {
  return (
    <div className="py-10 flex items-center justify-center">
      <div className="text-slate-600 font-medium">{label}</div>
    </div>
  );
}
