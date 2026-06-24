'use client';

import { AdminSidebarProps } from '@/types/admin';
import { FiUsers, FiPackage, FiBarChart2, FiSettings } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { icon: FiUsers, label: 'Users', href: '/admin/users' },
  { icon: FiPackage, label: 'Products', href: '/admin/products' },
  { icon: FiBarChart2, label: 'Analytics', href: '/admin/analytics' },
  { icon: FiSettings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onClose} />
      )}

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-56 bg-slate-900 text-white flex flex-col z-30 transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

        <div className="px-5 py-5 border-b border-slate-700/60">
          <p className="text-base font-extrabold tracking-tight text-white">CONSTRUCTPRO</p>
          <p className="text-xs text-slate-400 mt-0.5">Admin Portal</p>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <Link 
                key={label} 
                href={href} 
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all
                  ${isActive
                    ? 'border-l-2 border-orange-600 bg-slate-800 text-white font-semibold pl-[10px]'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-2 border-transparent pl-[10px]'
                  }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-slate-700/60">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="text-xs font-semibold text-slate-300 mt-0.5">Super Admin</p>
        </div>
      </aside>
    </>
  );
}
