import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="text-lg sm:text-xl font-black text-orange-500 tracking-wide">CONSTRUCTPRO</p>
        <p className="text-slate-600 text-xs sm:text-sm text-center">© 2026 ConstructPro Industrial Procurement. All rights reserved.</p>
        <div className="flex items-center gap-4 sm:gap-6">
         <Link href="/privacy" className="text-slate-600 hover:text-orange-500 font-medium transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-slate-600 hover:text-orange-500 font-medium transition-colors duration-300">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
