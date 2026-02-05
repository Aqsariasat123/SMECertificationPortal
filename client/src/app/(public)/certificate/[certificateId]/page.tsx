'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'var(--green-50)',
          border: 'var(--green-200)',
          color: 'var(--green-700)',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Valid Certificate',
        };
      case 'expired':
        return {
          bg: 'var(--amber-50)',
          border: 'var(--amber-200)',
          color: 'var(--amber-700)',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Expired Certificate',
        };
      case 'revoked':
        return {
          bg: 'var(--red-50)',
          border: 'var(--red-200)',
          color: 'var(--red-700)',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Revoked Certificate',
        };
      default:
        return {
          bg: 'var(--graphite-50)',
          border: 'var(--graphite-200)',
          color: 'var(--graphite-700)',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'Unknown Status',
        };
    }
  };

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin w-10 h-10 border-3 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: 'var(--teal-600)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--graphite-600)' }}>Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: 'var(--red-50)', border: '1px solid var(--red-200)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--red-100)' }}
            >
              <svg className="w-8 h-8" style={{ color: 'var(--red-600)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--red-800)' }}>
              Certificate Not Found
            </h1>
            <p style={{ color: 'var(--red-700)' }}>
              The certificate ID <code className="px-2 py-1 rounded" style={{ background: 'var(--red-100)' }}>{certificateId}</code> could not be verified.
            </p>
            <p className="mt-4 text-sm" style={{ color: 'var(--red-600)' }}>
              Please check the certificate ID and try again, or contact the issuing organization.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(certificate.status);

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Status Banner */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: statusBadge.bg, border: `1px solid ${statusBadge.border}` }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: statusBadge.border, color: statusBadge.color }}
            >
              {statusBadge.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: statusBadge.color }}>
                {statusBadge.label}
              </h2>
              <p className="text-sm" style={{ color: statusBadge.color }}>
                {certificate.status === 'active' && 'This certificate is valid and has been verified.'}
                {certificate.status === 'expired' && 'This certificate has expired and is no longer valid.'}
                {certificate.status === 'revoked' && (
                  <>
                    This certificate has been revoked.
                    {certificate.revocationReason && (
                      <span className="block mt-1">Reason: {certificate.revocationReason}</span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Details Card */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--white)', border: '1px solid var(--graphite-200)' }}
        >
          {/* Header */}
          <div className="p-6" style={{ background: 'var(--graphite-50)', borderBottom: '1px solid var(--graphite-200)' }}>
            <div className="flex items-center gap-3 mb-2">
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
                <p className="font-mono text-sm" style={{ color: 'var(--graphite-700)' }}>{certificate.certificateId}</p>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="p-6" style={{ borderBottom: '1px solid var(--graphite-200)' }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
              Certified Entity
            </p>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--graphite-900)' }}>
              {certificate.companyName}
            </h1>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--graphite-200)' }}>
            <div className="p-4" style={{ background: 'var(--white)' }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                Trade License
              </p>
              <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>
                {certificate.tradeLicenseNumber}
              </p>
            </div>
            <div className="p-4" style={{ background: 'var(--white)' }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                Industry Sector
              </p>
              <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>
                {certificate.industrySector}
              </p>
            </div>
            <div className="p-4" style={{ background: 'var(--white)' }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                Issued Date
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
            <div className="p-4" style={{ background: 'var(--white)' }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                Version
              </p>
              <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>
                {certificate.version}
              </p>
            </div>
            <div className="p-4" style={{ background: 'var(--white)' }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
                Status
              </p>
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                style={{ background: statusBadge.bg, color: statusBadge.color }}
              >
                {certificate.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Verification Hash */}
          <div className="p-4" style={{ background: 'var(--graphite-50)', borderTop: '1px solid var(--graphite-200)' }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>
              Verification Hash
            </p>
            <p className="font-mono text-xs break-all" style={{ color: 'var(--graphite-600)' }}>
              {certificate.verificationHash}
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--graphite-500)' }}>
          This verification was performed via the Naywa Registry System.
          <br />
          For inquiries, contact support@byredstone.com
        </p>
      </div>
    </div>
  );
}
