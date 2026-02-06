'use client';

import { useEffect, useState } from 'react';

export default function RegistryBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/public/stats`);
        const data = await response.json();
        if (data.success) {
          setCount(data.data.certifiedCount);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const formatCount = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k+`;
    }
    if (num > 0) {
      return `${num}+`;
    }
    return '0';
  };

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
      style={{ background: 'var(--teal-50)', color: 'var(--teal-700)', border: '1px solid var(--teal-200)' }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: 'var(--teal-500)' }}
      />
      {count !== null
        ? `Registry Status: ${formatCount(count)} Certified Entities`
        : 'Registry Status: Loading...'
      }
    </div>
  );
}
