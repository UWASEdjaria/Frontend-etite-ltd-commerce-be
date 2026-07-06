'use client';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { adminAnalyticsService } from '@/services/adminAnalytics.service';

export default function AdminNotificationManager() {
  const lastOrderCount = useRef<number | null>(null);


  useEffect(() => {
    const savedCount = localStorage.getItem('lastOrderCount');
    if (savedCount) {
      lastOrderCount.current = parseInt(savedCount, 10);
    }

    const checkUpdates = async () => {
      try {
        const summary = await adminAnalyticsService.getSummary();

        if (lastOrderCount.current !== null && summary.totalOrders > lastOrderCount.current) {
          toast.success("New order received!");
        }

        lastOrderCount.current = summary.totalOrders;
        localStorage.setItem('lastOrderCount', summary.totalOrders.toString());
      } catch {
        // silent — polling failure should never affect page
      }
    };

    const initialDelay = setTimeout(checkUpdates, 5000);
    const interval = setInterval(checkUpdates, 30000);
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return null;
}
