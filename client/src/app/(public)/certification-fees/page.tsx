'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { LegalPageData } from '@/types';

const DEFAULT_CONTENT = `## Overview

Naywa provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency purposes.

## Fee Determination

Certification fees are determined administratively on a case-by-case basis. The applicable fee may vary depending on factors such as the scope of certification, entity profile, and nature of the assessment required.

There is no standard published rate. Fees are communicated directly to the applicant following certification approval.

## Payment Process

Payment is requested only after the certification application has been reviewed and approved. No payment is required at the time of application submission.

Upon approval, the applicant will receive a payment request with the applicable fee amount and invoice details.

## VAT Information

Naywa is currently not registered for VAT under UAE VAT Law. As such, VAT is not applicable to certification fees at this time.

VAT status is indicated on all invoices issued. Should VAT registration status change in the future, the applicable VAT rate (currently 5% under UAE VAT Law) will be applied and clearly reflected on invoices with a full breakdown.

---

*This page is provided for informational purposes only and does not constitute a fee schedule, price list, or contractual offer. All fees are subject to administrative determination and may be updated without prior notice.*`;

export default function CertificationFeesPage() {
  const [page, setPage] = useState<LegalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await api.getLegalPage('certification-fees');
        if (response.success && response.data) {
          setPage(response.data);
        } else {
          // Use default content if page doesn't exist in database yet
          setPage({
            slug: 'certification-fees',
            title: 'Certification Fees and Services',
            content: DEFAULT_CONTENT,
            lastUpdated: new Date().toISOString(),
          });
        }
      } catch {
        // Use default content on error
        setPage({
          slug: 'certification-fees',
          title: 'Certification Fees and Services',
          content: DEFAULT_CONTENT,
          lastUpdated: new Date().toISOString(),
        });
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
          <div className="h-8 rounded w-1/3" style={{ background: 'var(--graphite-200)' }} />
          <div className="h-4 rounded w-full" style={{ background: 'var(--graphite-100)' }} />
          <div className="h-4 rounded w-5/6" style={{ background: 'var(--graphite-100)' }} />
          <div className="h-4 rounded w-4/6" style={{ background: 'var(--graphite-100)' }} />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p style={{ color: 'var(--graphite-500)' }}>{error || 'Page not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--graphite-900)' }}>{page.title}</h1>
      <p className="text-xs mb-8" style={{ color: 'var(--graphite-400)' }}>
        Last updated: {new Date(page.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div
        className="prose prose-sm max-w-none legal-content"
        style={{ color: 'var(--graphite-700)' }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
      />
    </div>
  );
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-6 mb-2" style="color: var(--graphite-800)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-8 mb-3" style="color: var(--graphite-900)">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc mb-4">$&</ul>')
    .replace(/^---$/gm, '<hr class="my-6 border-t" style="border-color: var(--graphite-200)" />')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^(?!<[hul]|<hr)/gm, (match) => match ? `<p class="mb-3">${match}` : match)
    .replace(/<p class="mb-3"><\/p>/g, '');
}
