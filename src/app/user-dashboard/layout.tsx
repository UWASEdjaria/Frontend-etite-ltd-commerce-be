'use client';

import DashboardSidebar from '@/components/user-dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/user-dashboard/DashboardTopbar';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* SIDEBAR COMPONENT */}
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR NAVIGATION CONTROLS */}
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

        {/* DYNAMIC CHILD PAGES VIEW */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}