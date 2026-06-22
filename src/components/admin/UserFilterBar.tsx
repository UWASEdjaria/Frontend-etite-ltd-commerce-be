'use client';

import { UserFilters } from '@/lib/userFilters';

interface UserFilterBarProps {
  filters: UserFilters;
  onChange: (filters: UserFilters) => void;
}

export default function UserFilterBar({ filters, onChange }: UserFilterBarProps) {
  const inputClass = 'h-8 px-3 text-xs text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-orange-600 placeholder:text-slate-400';

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center gap-2 shrink-0">
      <input
        type="text"
        placeholder="Search name or email..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className={`${inputClass} w-48`}
        aria-label="Search users"
        title="Search users"
      />

      <select
        value={filters.role}
        onChange={(e) => onChange({ ...filters, role: e.target.value as UserFilters['role'] })}
        className={inputClass}
        aria-label="Filter by role"
        title="Filter by role"
      >
        <option value="ALL">All Roles</option>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as UserFilters['status'] })}
        className={inputClass}
        aria-label="Filter by status"
        title="Filter by status"
      >
        <option value="ALL">All Status</option>
        <option value="VERIFIED">Verified</option>
        <option value="PENDING">Pending</option>
      </select>

      {(filters.search || filters.role !== 'ALL' || filters.status !== 'ALL') && (
        <button
          onClick={() => onChange({ search: '', role: 'ALL', status: 'ALL' })}
          className="text-xs text-slate-400 hover:text-red-500 transition"
        >
          Clear
        </button>
      )}
    </div>
  );
}
