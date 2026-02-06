'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CertificateVerification } from '@/types';

export default function VerifyCertificatePage() {
  const params = useParams();
  const certificateId = params.certificateId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<CertificateVerification | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);

      const response = await api.verifyCertificate(certificateId);

      if (response.success && response.data) {
        setCertificate(response.data);
      } else {
        setError(response.message || 'Certificate not found');
      }

      setLoading(false);
    };

    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Status badge styling
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'var(--green-50)',
          border: 'var(--green-200)',
          color: 'var(--green-700)',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Certification Status: Active',
        };
      case 'expired':
        return {
          bg: 'var(--amber-50)',
          border: 'var(--amber-200)',
          color: 'var(--amber-700)',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Certification Status: Expired',
        };
      case 'revoked':
        return {
          bg: 'var(--red-50)',
          border: 'var(--red-200)',
          color: 'var(--red-700)',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          ),
          label: 'Certification Status: Suspended',
        };
      default:
        return {
          bg: 'var(--graphite-50)',
          border: 'var(--graphite-200)',
          color: 'var(--graphite-700)',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Unknown Status',
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col">
        <div className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-3 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: 'var(--teal-600)', borderTopColor: 'transparent' }} />
            <p style={{ color: 'var(--graphite-600)' }}>Verifying certificate...</p>
          </div>
        </div>
        <FooterDisclaimer />
      </div>
    );
  }

  // Not Found state
  if (error || !certificate) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col">
        <div className="flex-1 py-16 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Status Banner */}
            <div
              className="rounded-xl p-6 mb-6"
              style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--graphite-200)', color: 'var(--graphite-600)' }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--graphite-800)' }}>
                  No Matching Record Found
                </h2>
              </div>
            </div>

            {/* Details */}
            <div
              className="rounded-xl p-6"
              style={{ background: 'var(--white)', border: '1px solid var(--graphite-200)' }}
            >
              <p className="mb-4" style={{ color: 'var(--graphite-700)' }}>
                No active or historical certification record was found for the provided information.
              </p>
              <p className="mb-6" style={{ color: 'var(--graphite-600)' }}>
                Please check the Certificate ID and try again.
              </p>
              <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                  Searched Certificate ID
                </p>
                <p className="font-mono text-sm" style={{ color: 'var(--graphite-700)' }}>
                  {certificateId}
                </p>
              </div>
              <Link
                href="/registry/verify"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: 'var(--teal-600)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Try another verification
              </Link>
            </div>
          </div>
        </div>
        <FooterDisclaimer />
      </div>
    );
  }

  const statusConfig = getStatusConfig(certificate.status);
  const isInactive = certificate.status === 'expired' || certificate.status === 'revoked';

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      <div className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Status Banner */}
          <div
            className="rounded-xl p-6 mb-6"
            style={{ background: statusConfig.bg, border: `1px solid ${statusConfig.border}` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: statusConfig.border, color: statusConfig.color }}
              >
                {statusConfig.icon}
              </div>
              <h2 className="text-lg font-semibold" style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </h2>
            </div>
          </div>

          {/* Certificate Details Card */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--white)', border: '1px solid var(--graphite-200)' }}
          >
            {/* Header */}
            <div className="p-6" style={{ background: 'var(--graphite-50)', borderBottom: '1px solid var(--graphite-200)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--teal-600)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>Naywa SME Certification</p>
                </div>
              </div>
            </div>

            {/* Company Legal Name */}
            <div className="p-6" style={{ borderBottom: '1px solid var(--graphite-200)' }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                Company Legal Name
              </p>
              <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--graphite-900)' }}>
                {certificate.companyName}
              </h1>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'var(--graphite-200)' }}>
              <div className="p-4" style={{ background: 'var(--white)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                  Certificate ID
                </p>
                <p className="font-mono font-medium" style={{ color: 'var(--graphite-900)' }}>
                  {certificate.certificateId}
                </p>
              </div>
              <div className="p-4" style={{ background: 'var(--white)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                  Certification Status
                </p>
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                  style={{ background: statusConfig.bg, color: statusConfig.color }}
                >
                  {certificate.status === 'revoked' ? 'SUSPENDED' : certificate.status.toUpperCase()}
                </span>
              </div>
              <div className="p-4" style={{ background: 'var(--white)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                  Issue Date
                </p>
                <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>
                  {formatDate(certificate.issuedAt)}
                </p>
              </div>
              <div className="p-4" style={{ background: 'var(--white)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                  Expiry Date
                </p>
                <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>
                  {formatDate(certificate.expiresAt)}
                </p>
              </div>
              <div className="p-4 sm:col-span-2" style={{ background: 'var(--white)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                  Sector
                </p>
                <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>
                  {certificate.industrySector}
                </p>
              </div>
            </div>

            {/* Registry Statement */}
            <div className="p-4" style={{ background: 'var(--graphite-50)', borderTop: '1px solid var(--graphite-200)' }}>
              {isInactive ? (
                <div>
                  <p className="text-sm" style={{ color: 'var(--graphite-600)' }}>
                    This certification is no longer active according to Naywa&apos;s registry records.
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--graphite-500)' }}>
                    For clarification, contact the certificate holder directly.
                  </p>
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--graphite-600)' }}>
                  This record reflects the certification status at the time of verification.
                </p>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-6">
            <Link
              href="/registry/verify"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--teal-600)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Verify another certificate
            </Link>
          </div>
        </div>
      </div>
      <FooterDisclaimer />
    </div>
  );
}

function FooterDisclaimer() {
  return (
    <section className="py-8 px-4 mt-auto" style={{ background: 'var(--graphite-50)', borderTop: '1px solid var(--graphite-200)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>
          Naywa certification reflects an independent, documentation-based assessment conducted at a specific point in time. Verification confirms registry status only and does not constitute regulatory approval, legal advice, or endorsement.
        </p>
      </div>
    </section>
  );
}
