'use client';
import { useEffect, useRef, useState } from 'react';
import { adminAnalyticsService } from '@/services/adminAnalytics.service';
import { adminStockService } from '@/services/adminStockService';

export type AdminNotification = {
  id: string;
  type: 'ORDER' | 'LOW_STOCK' | 'EXPIRED';
  message: string;
  at: Date;
  read: boolean;
};

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const lastOrderCount = useRef<number | null>(null);

  const addNotif = (type: AdminNotification['type'], message: string) => {
    setNotifications(prev => [
      { id: `${Date.now()}-${Math.random()}`, type, message, at: new Date(), read: false },
      ...prev.slice(0, 49), // keep max 50
    ]);
  };

  useEffect(() => {
    const saved = localStorage.getItem('lastOrderCount');
    if (saved) lastOrderCount.current = parseInt(saved, 10);

    const poll = async () => {
      try {
        const [summary, stock] = await Promise.all([
          adminAnalyticsService.getSummary(),
          adminStockService.getAll(1),
        ]);

        // New orders
        if (lastOrderCount.current !== null && summary.totalOrders > lastOrderCount.current) {
          const diff = summary.totalOrders - lastOrderCount.current;
          addNotif('ORDER', `${diff} new order${diff > 1 ? 's' : ''} received`);
        }
        lastOrderCount.current = summary.totalOrders;
        localStorage.setItem('lastOrderCount', summary.totalOrders.toString());

        // Expired batches
        const expired = stock.data.filter(s => s.status === 'EXPIRED');
        if (expired.length > 0) {
          addNotif('EXPIRED', `${expired.length} expired batch${expired.length > 1 ? 'es' : ''} need attention`);
        }

        // Low stock batches
        const low = stock.data.filter(s => s.status === 'LOW');
        if (low.length > 0) {
          addNotif('LOW_STOCK', `${low.length} product${low.length > 1 ? 's' : ''} running low on stock`);
        }
      } catch {
        // silent
      }
    };

    const delay = setTimeout(poll, 5000);
    const interval = setInterval(poll, 30000);
    return () => { clearTimeout(delay); clearInterval(interval); };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return { notifications, unreadCount, markAllRead };
}
