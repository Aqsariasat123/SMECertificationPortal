'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { LegalPageData } from '@/types';

export default function CertificationStandardsPage() {
  const [page, setPage] = useState<LegalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await api.getLegalPage('certification-standards');
        if (response.success && response.data) {
          setPage(response.data);
        } else {
          setError('Page not found');
        }
      } catch {
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 rounded w-1/3" style={{ background: '#D0E4E4' }} />
          <div className="h-4 rounded w-full" style={{ background: '#E8F4F4' }} />
          <div className="h-4 rounded w-5/6" style={{ background: '#E8F4F4' }} />
          <div className="h-4 rounded w-4/6" style={{ background: '#E8F4F4' }} />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p style={{ color: '#5A7070' }}>{error || 'Page not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#111C1C' }}>{page.title}</h1>
      <p className="text-xs mb-8" style={{ color: '#5A7070' }}>
        Last updated: {new Date(page.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div
        className="prose prose-sm max-w-none legal-content"
        style={{ color: '#1A2A2A' }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
      />
    </div>
  );
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-6 mb-2" style="color: #111C1C">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-8 mb-3" style="color: #111C1C">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc mb-4">$&</ul>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^(?!<[hul])/gm, (match) => match ? `<p class="mb-3">${match}` : match)
    .replace(/<p class="mb-3"><\/p>/g, '');
}
