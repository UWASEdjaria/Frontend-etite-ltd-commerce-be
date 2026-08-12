'use client';

import { AdminTopbarProps } from '@/types/admin';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { FiLogOut, FiBell, FiPackage, FiAlertTriangle, FiShoppingBag } from 'react-icons/fi';
import Logo from '../ui/Logo';
import { useAdminNotifications, AdminNotification } from '@/hooks/useAdminNotifications';

const NOTIF_ICON: Record<AdminNotification['type'], React.ReactNode> = {
  ORDER: <FiShoppingBag className="text-orange-500" size={15} />,
  LOW_STOCK: <FiAlertTriangle className="text-yellow-500" size={15} />,
  EXPIRED: <FiPackage className="text-red-500" size={15} />,
};

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps & { title: string }) {
  const { initials, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = useAdminNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(prev => !prev);
    if (!open) markAllRead();
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0 z-50 relative">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-slate-500 hover:text-slate-800" onClick={onMenuClick} aria-label="Toggle menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Logo />
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleOpen}
            className="relative p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            aria-label="Notifications"
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} className="text-xs text-orange-500 hover:underline">Mark all read</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No notifications yet</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${!n.read ? 'bg-orange-50' : ''}`}>
                      <div className="mt-0.5">{NOTIF_ICON[n.type]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {n.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.read && <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 shrink-0" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {mounted && (
          <Link
            href="/user-dashboard/profile"
            className="w-10 h-10 md:w-8 md:h-8 rounded-full border-2 border-orange-500 text-orange-500 flex items-center justify-center font-bold"
          >
            {initials}
          </Link>
        )}
        <button onClick={logout} className="flex items-center text-sm gap-2 text-gray-600 hover:text-red-600">
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
}
