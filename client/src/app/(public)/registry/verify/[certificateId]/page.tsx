'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CertificateVerification } from '@/types';
import { QRCodeSVG } from 'qrcode.react';

// Status configuration
const statusConfig = {
  active: {
    label: 'Active',
    color: '#1A6B3C',
    bgColor: 'rgba(26,107,60,0.1)',
  },
  expired: {
    label: 'Expired',
    color: '#92620A',
    bgColor: 'rgba(146,98,10,0.1)',
  },
  revoked: {
    label: 'Revoked',
    color: '#8B2020',
    bgColor: 'rgba(139,32,32,0.1)',
  },
  deferred: {
    label: 'Deferred',
    color: '#92620A',
    bgColor: 'rgba(146,98,10,0.1)',
  },
};

const notFoundConfig = {
  label: 'Not Found',
  color: '#5A7070',
  bgColor: 'rgba(90,112,112,0.1)',
};

const pillarsLeft = [
  'Legal & Ownership Readiness',
  'Financial Discipline',
  'Business Model & Unit Economics',
];

const pillarsRight = [
  'Governance & Controls',
  'Data Integrity, Auditability & Information Reliability',
];

export default function VerifyCertificatePage() {
  const params = useParams();
  const router = useRouter();
  const certificateId = params.certificateId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<CertificateVerification | null>(null);
  const [searchInput, setSearchInput] = useState(certificateId);

  const verificationUrl = `https://naywa.ae/registry/verify/${certificateId}`;

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
      setSearchInput(certificateId);
    }
  }, [certificateId]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = searchInput.trim().toUpperCase();
    if (trimmedId && trimmedId !== certificateId) {
      router.push(`/registry/verify/${trimmedId}`);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <div className="text-center">
          <div
            className="w-10 h-10 border-3 border-t-transparent rounded-full mx-auto mb-4 animate-spin"
            style={{ borderColor: '#2D6A6A', borderTopColor: 'transparent', borderWidth: '3px' }}
          />
          <p style={{ color: '#5A7070' }}>Verifying certificate...</p>
        </div>
      </div>
    );
  }

  // Not Found or Deferred state
  if (error || !certificate || certificate.status === 'deferred') {
    const isDeferred = certificate?.status === 'deferred';
    const config = isDeferred ? statusConfig.deferred : notFoundConfig;

    return (
      <div className="flex-1 flex flex-col">
        <main className="flex-1 py-20 px-6 flex flex-col items-center" style={{ paddingTop: '96px' }}>
          <div className="text-center max-w-[520px] mb-12">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#2D6A6A' }}>
              Certificate Verification
            </p>
            <h1 className="text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] mb-3.5" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
              Verify a Naywa Certificate
            </h1>
          </div>

          <div className="w-full max-w-[540px] mb-12">
            <form onSubmit={handleVerify}>
              <div className="flex overflow-hidden rounded-xl" style={{ background: 'white', border: '1.5px solid #D0E4E4' }}>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                  placeholder="Enter Certificate ID — e.g. SME-CERT-E099E930"
                  className="flex-1 border-none outline-none py-4 px-5 text-[15px]"
                  style={{ color: '#1A2A2A', background: 'transparent' }}
                />
                <button type="submit" className="px-7 text-sm font-semibold" style={{ background: '#2D6A6A', color: 'white' }}>
                  Verify
                </button>
              </div>
            </form>
          </div>

          <div className="w-full max-w-[600px]">
            <div className="rounded-2xl p-10 text-center" style={{ background: 'white', border: '1px solid #D0E4E4' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: config.bgColor }}>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isDeferred ? (
                    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>
                  ) : (
                    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>
                  )}
                </svg>
              </div>
              <span className="inline-block text-xs font-bold tracking-[0.1em] uppercase px-4 py-1.5 rounded-full mb-4" style={{ background: config.bgColor, color: config.color }}>
                {config.label}
              </span>
              <p className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
                {isDeferred ? 'Certification Deferred' : 'No Record Found'}
              </p>
              <p className="text-sm leading-[1.7] max-w-[380px] mx-auto mb-6" style={{ color: '#5A7070' }}>
                {isDeferred ? 'Certification review incomplete. Status: Deferred.' : 'No certificate record found matching this ID.'}
              </p>
            </div>
            <div className="mt-6 text-center">
              <Link href="/registry/verify" className="inline-flex items-center gap-2 text-[13px] font-medium" style={{ color: '#2D6A6A' }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Verify another certificate
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const status = certificate.status as keyof typeof statusConfig;
  const config = statusConfig[status] || statusConfig.active;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 py-8 px-4 md:px-6 flex flex-col items-center" style={{ paddingTop: '80px' }}>
        {/* Search Box */}
        <div className="w-full max-w-[680px] mb-6">
          <form onSubmit={handleVerify}>
            <div className="flex overflow-hidden rounded-xl" style={{ background: 'white', border: '1.5px solid #D0E4E4' }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                placeholder="Enter Certificate ID — e.g. SME-CERT-E099E930"
                className="flex-1 border-none outline-none py-3 px-5 text-[14px]"
                style={{ color: '#1A2A2A', background: 'transparent' }}
              />
              <button type="submit" className="px-6 text-sm font-semibold" style={{ background: '#2D6A6A', color: 'white' }}>
                Verify
              </button>
            </div>
          </form>
        </div>

        {/* Certificate Document - Matching PDF Template */}
        <div className="w-full max-w-[680px] rounded-xl overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

          {/* HEADER - Dark teal (matching PDF) */}
          <div className="relative overflow-hidden" style={{ background: '#2D6A6A', padding: '28px 32px 24px' }}>
            {/* Curved corner decoration */}
            <div className="absolute top-0 right-0" style={{ width: '180px', height: '180px', background: '#5DB5A8', borderRadius: '0 0 0 100%', opacity: 0.15 }} />

            <div className="relative z-10">
              {/* Top row: Logo + Certificate Type */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-[15px]">Naywa</p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>SME Certification Registry</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-medium tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Certificate Type</p>
                  <p className="text-[13px] font-semibold" style={{ color: '#5DB5A8' }}>SME Capital-Readiness</p>
                </div>
              </div>

              {/* Title + Issue Date */}
              <div className="flex items-end justify-between">
                <h1 className="text-[26px] font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}>
                  Certificate of SME Certification
                </h1>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-[9px] font-medium tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Issued</p>
                  <p className="text-[13px] font-semibold" style={{ color: '#5DB5A8' }}>{formatDate(certificate.issuedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="p-8">
            {/* Description */}
            <p className="text-[12px] leading-[1.7] mb-7" style={{ color: '#5A7070' }}>
              This certificate attests that the entity named below has successfully completed the Naywa SME certification process and meets the documentation and governance standards required for capital readiness assessment.
            </p>

            {/* Entity Name */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: '#2D6A6A' }}>Entity Name</p>
              <p className="text-[36px] font-bold leading-none pb-2" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
                {certificate.companyName}
              </p>
              <div className="w-[100px] h-[3px] mt-2" style={{ background: '#2D6A6A' }} />
            </div>

            {/* Trade License + Sector */}
            <div className="grid grid-cols-2 gap-8 mb-7">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: '#5A7070' }}>Trade License Number</p>
                <p className="text-[15px] font-semibold" style={{ color: '#111C1C' }}>{certificate.tradeLicenseNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: '#5A7070' }}>Industry Sector</p>
                <p className="text-[15px] font-semibold" style={{ color: '#111C1C' }}>{certificate.industrySector}</p>
              </div>
            </div>

            {/* Certificate Info Box */}
            <div className="rounded-lg overflow-hidden mb-7" style={{ background: '#F8FBFB', border: '1px solid #E8F0F0' }}>
              <div className="flex" style={{ borderLeft: '4px solid #2D6A6A' }}>
                <div className="flex-1 py-4 px-4" style={{ borderRight: '1px solid #E8F0F0' }}>
                  <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: '#5A7070' }}>Certificate ID</p>
                  <p className="text-[12px] font-semibold tracking-wide" style={{ color: '#111C1C', fontFamily: 'monospace' }}>{certificate.certificateId}</p>
                </div>
                <div className="py-4 px-4" style={{ borderRight: '1px solid #E8F0F0', width: '80px' }}>
                  <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: '#5A7070' }}>Version</p>
                  <p className="text-[13px] font-semibold" style={{ color: '#111C1C' }}>{certificate.version || 'v1.0'}</p>
                </div>
                <div className="py-4 px-4" style={{ borderRight: '1px solid #E8F0F0', width: '120px' }}>
                  <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: '#5A7070' }}>Issue Date</p>
                  <p className="text-[12px] font-semibold" style={{ color: '#111C1C' }}>{formatDate(certificate.issuedAt)}</p>
                </div>
                <div className="py-4 px-4" style={{ borderRight: '1px solid #E8F0F0', width: '120px' }}>
                  <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: '#5A7070' }}>Expiry Date</p>
                  <p className="text-[12px] font-semibold" style={{ color: '#111C1C' }}>{formatDate(certificate.expiresAt)}</p>
                </div>
                <div className="py-4 px-4" style={{ width: '100px' }}>
                  <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: '#5A7070' }}>Status</p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: config.bgColor, color: config.color }}>
                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: config.color }} />
                    {config.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Pillars Assessed */}
            <div className="mb-7">
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: '#2D6A6A' }}>Pillars Assessed</p>
                <div className="flex-1 h-[1px]" style={{ background: '#D0E4E4' }} />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div className="space-y-2">
                  {pillarsLeft.map((pillar, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <p className="text-[12px]" style={{ color: '#1A2A2A' }}>{pillar}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {pillarsRight.map((pillar, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <p className="text-[12px]" style={{ color: '#1A2A2A' }}>{pillar}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Box with QR Code */}
            <div className="rounded-lg p-5" style={{ background: '#EFF7F6' }}>
              <div className="flex gap-5">
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#5A7070' }}>Verification Hash</p>
                    <p className="text-[11px] font-medium mb-1" style={{ color: '#1A2A2A', fontFamily: 'monospace' }}>{certificate.verificationHash}</p>
                    <p className="text-[9px]" style={{ color: '#5A7070' }}>This hash uniquely identifies the certificate and supports integrity verification.</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#5A7070' }}>Verification URL</p>
                    <a href={verificationUrl} className="text-[11px] font-medium break-all" style={{ color: '#2D6A6A' }}>{verificationUrl}</a>
                  </div>
                </div>
                {/* QR Code */}
                <div className="flex-shrink-0">
                  <QRCodeSVG value={verificationUrl} size={75} />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER - Dark teal (matching PDF) */}
          <div style={{ background: '#2D6A6A', padding: '16px 32px' }}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-[9px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '420px' }}>
                Digitally issued via Naywa Registry. This document is electronically generated and does not require a physical signature. Certification reflects assessment based on documentation at time of review. Verification confirms status recorded in Naywa&apos;s certification register at time of query.
              </p>
              <div className="flex-shrink-0 px-4 py-2 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <p className="text-[10px] font-bold text-white">NAYWA CERTIFIED</p>
                <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Digital Verification Seal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verify Another */}
        <div className="mt-6 text-center">
          <Link href="/registry/verify" className="inline-flex items-center gap-2 text-[13px] font-medium" style={{ color: '#2D6A6A' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Verify another certificate
          </Link>
        </div>
      </main>
    </div>
  );
}
