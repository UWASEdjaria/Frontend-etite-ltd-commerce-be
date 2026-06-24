'use client';

import DashboardSidebar from '@/components/user-dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/user-dashboard/DashboardTopbar';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}