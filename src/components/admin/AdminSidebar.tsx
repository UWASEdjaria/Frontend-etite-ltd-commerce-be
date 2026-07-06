'use client';

import { AdminSidebarProps } from '@/types/admin';
import { FiUsers, FiPackage, FiBarChart2, FiSettings, FiShoppingBag, FiHome, FiMail } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  
  { icon: FiHome, label: "Home", href: "/" },
  { icon: FiUsers, label: 'Users', href: '/admin/users' },
  { icon: FiMail,  label: 'Messages', href: '/admin/messages'},
  { icon: FiPackage, label: 'Products', href: '/admin/products' },
  { icon: FiShoppingBag, label: 'Orders', href: '/admin/orders' },
  { icon: FiBarChart2, label: 'Analytics', href: '/admin/analytics' },
  { icon: FiPackage, label: 'Stock', href: '/admin/stock' },
  //{ icon: FiSettings, label: 'Settings', href: '/admin/settings' },
 
];

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Dark overlay — mobile only */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-[190] md:hidden" onClick={onClose} />
      )}

      {/*
        MOBILE: fixed overlay, slides in/out based on open state
        DESKTOP (md+): always visible static sidebar, pushes content right
      */}
      <aside className={`
        fixed top-[64px] left-0 bottom-0 z-[40] w-56 bg-white border-r border-slate-200 text-slate-700 flex flex-col
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0 md:shrink-0
      `}>

        <div className="px-5 py-5">
          
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <Link 
                key={label} 
                href={href} 
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all
                ${isActive
                ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">Super Admin</p>
        </div>
      </aside>
    </>
  );
}
