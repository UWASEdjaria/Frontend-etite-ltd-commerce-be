export default function Footer() {
  return (
    <footer className="bg-slate-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="font-extrabold tracking-tight text-white">CONSTRUCTPRO</p>
        <p className="text-slate-400">© 2026 ConstructPro Industrial Procurement. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="text-slate-400 hover:text-orange-500 transition">Privacy Policy</a>
          <a href="#" className="text-slate-400 hover:text-orange-500 transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
