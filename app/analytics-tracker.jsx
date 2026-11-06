'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '../lib/track-client';

// 주소(pathname)가 바뀔 때마다 page_view를 한 번 기록합니다.
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    track('page_view');
  }, [pathname]);

  return null;
}
