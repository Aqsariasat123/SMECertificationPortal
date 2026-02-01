'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.requestId as string;

  useEffect(() => {
    // Redirect to the new messages page with chat parameter
    router.replace(`/sme/messages?chat=${requestId}`);
  }, [requestId, router]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#d1fae5', borderTopColor: '#14b8a6' }}></div>
        <p style={{ color: '#6b7280' }}>Redirecting to messages...</p>
      </div>
    </div>
  );
}
