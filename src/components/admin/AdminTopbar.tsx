'use client';

import { AdminTopbarProps } from '@/types/admin';

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-slate-500 hover:text-slate-800" onClick={onMenuClick} aria-label="Open menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-slate-800">User Management</h1>
      </div>
      <span className="px-3 py-1 bg-orange-50 text-orange-700 font-bold text-xs rounded-full border border-orange-200">Super Admin</span>
    </header>
  );
}
