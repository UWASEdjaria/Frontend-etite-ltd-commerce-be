'use client';
import { useState } from 'react';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-slate-50 border-b border-slate-200 z-50 sticky top-0">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Logo variant="dark" href="/" />

        <div className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-slate-600 hover:text-orange-700 font-semibold transition text-sm">Home</Link>
          <Link href="/login" className="text-slate-600 hover:text-orange-700 font-semibold transition text-sm">Sign In</Link>
          <Link href="/signup" className="px-4 py-2 bg-orange-700 text-white rounded-lg font-semibold hover:bg-orange-800 transition text-sm">Register</Link>
        </div>

        <button className="sm:hidden text-slate-700" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="sm:hidden bg-slate-50 border-t border-slate-200 px-4 pb-4 flex flex-col gap-2">
          <Link href="/" className="text-slate-600 font-semibold py-2 text-sm" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/login" className="text-slate-600 font-semibold py-2 text-sm" onClick={() => setOpen(false)}>Sign In</Link>
          <Link href="/signup" className="text-center px-4 py-2 bg-orange-700 text-white rounded-lg font-semibold text-sm" onClick={() => setOpen(false)}>Register</Link>
        </div>
      )}
    </header>
  );
}
