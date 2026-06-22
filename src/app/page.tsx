import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=870&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/65" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
        <span className="inline-block mb-4 px-4 py-1 bg-orange-700/20 border border-orange-500 text-orange-300 text-xs font-bold rounded-full tracking-widest uppercase">
          Industrial Procurement
        </span>
        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl leading-tight">
          Construction Tools & Equipment
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
          Source quality construction tools, heavy equipment, and building supplies for professionals and large-scale projects.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="w-full sm:w-auto text-center px-8 py-3 bg-orange-700 text-white font-bold rounded-lg hover:bg-orange-800 transition">
            Sign In
          </Link>
          <Link href="/signup" className="w-full sm:w-auto text-center px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
