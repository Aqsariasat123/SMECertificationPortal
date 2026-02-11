'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '@/lib/api';
import { CertificateVerification } from '@/types';

// Status configuration for certificate states
const statusConfig = {
  active: {
    label: 'Active',
    color: '#1A6B3C',
    bgColor: 'rgba(26,107,60,0.1)',
    headerBg: '#2D6A6A',
    headerAccent: '#3D8B8B',
    description: "This certificate is active and recorded in Naywa's certification register.",
  },
  expired: {
    label: 'Expired',
    color: '#92620A',
    bgColor: 'rgba(146,98,10,0.1)',
    headerBg: '#4A4035',
    headerAccent: '#92620A',
    description: 'Certificate has expired as of',
  },
  revoked: {
    label: 'Revoked',
    color: '#8B2020',
    bgColor: 'rgba(139,32,32,0.1)',
    headerBg: '#3D2020',
    headerAccent: '#8B2020',
    description: 'This certificate has been revoked.',
  },
  deferred: {
    label: 'Deferred',
    color: '#92620A',
    bgColor: 'rgba(146,98,10,0.1)',
    headerBg: '#4A4035',
    headerAccent: '#92620A',
    description: 'Certification review incomplete. Status: Deferred.',
  },
};

const notFoundConfig = {
  label: 'Not Found',
  color: '#5A7070',
  bgColor: 'rgba(90,112,112,0.1)',
  description: 'No certificate record found matching this ID.',
};

const pillars = [
  'Legal & Ownership Readiness',
  'Financial Discipline',
  'Business Model & Unit Economics',
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

  const verificationUrl = `https://naywa.ae/registry/verify/${certificateId}`;

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

  // Not Found or Deferred state - show message only, no certificate
  if (error || !certificate || certificate.status === 'deferred') {
    const isDeferred = certificate?.status === 'deferred';
    const config = isDeferred ? statusConfig.deferred : notFoundConfig;

    return (
      <div className="flex-1 flex flex-col">
        <main className="flex-1 py-20 px-6 flex flex-col items-center" style={{ paddingTop: '96px' }}>
          {/* Header */}
          <div className="text-center max-w-[520px] mb-12" style={{ animation: 'fadeUp 0.6s 0.1s both' }}>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#2D6A6A' }}>
              Certificate Verification
            </p>
            <h1
              className="text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] mb-3.5 tracking-[-0.01em]"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
            >
              Verify a Naywa Certificate
            </h1>
            <p className="text-sm leading-[1.7]" style={{ color: '#5A7070' }}>
              Enter a Certificate ID to retrieve its current status from Naywa&apos;s certification register.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-[540px] mb-12" style={{ animation: 'fadeUp 0.6s 0.2s both' }}>
            <form onSubmit={handleVerify}>
              <div
                className="flex overflow-hidden rounded-xl transition-all"
                style={{
                  background: 'white',
                  border: '1.5px solid #D0E4E4',
                  boxShadow: '0 2px 12px rgba(45,106,106,0.07)',
                }}
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                  placeholder="Enter Certificate ID — e.g. SME-CERT-E099E930"
                  className="flex-1 border-none outline-none py-4 px-5 text-[15px] tracking-[0.02em]"
                  style={{ color: '#1A2A2A', background: 'transparent' }}
                />
                <button
                  type="submit"
                  className="px-7 text-sm font-semibold whitespace-nowrap transition-colors"
                  style={{ background: '#2D6A6A', color: 'white', border: 'none' }}
                >
                  Verify
                </button>
              </div>
            </form>
          </div>

          {/* Result Card */}
          <div className="w-full max-w-[600px]" style={{ animation: 'fadeUp 0.6s 0.3s both' }}>
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: 'white', border: '1px solid #D0E4E4', boxShadow: '0 4px 24px rgba(45,106,106,0.06)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: config.bgColor }}
              >
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={config.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isDeferred ? (
                    <>
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </>
                  ) : (
                    <>
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </>
                  )}
                </svg>
              </div>
              <span
                className="inline-block text-xs font-bold tracking-[0.1em] uppercase px-4 py-1.5 rounded-full mb-4"
                style={{ background: config.bgColor, color: config.color }}
              >
                {config.label}
              </span>
              <p
                className="text-xl font-bold mb-3"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                {isDeferred ? 'Certification Deferred' : 'No Record Found'}
              </p>
              <p className="text-sm leading-[1.7] max-w-[380px] mx-auto mb-6" style={{ color: '#5A7070' }}>
                {config.description}
              </p>
              {!isDeferred && (
                <span
                  className="inline-block text-xs px-5 py-3 rounded-lg"
                  style={{ color: '#5A7070', background: '#F5FAFA', border: '1px solid #D0E4E4' }}
                >
                  Certificate IDs follow the format: SME-CERT-XXXXXXXX
                </span>
              )}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/registry/verify"
                className="inline-flex items-center gap-2 text-[13px] font-medium no-underline transition-all hover:gap-3"
                style={{ color: '#2D6A6A' }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Verify another certificate
              </Link>
            </div>
          </div>
        </main>

        <style jsx>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Get status config for found certificates (active, expired, revoked)
  const status = certificate.status as keyof typeof statusConfig;
  const config = statusConfig[status] || statusConfig.active;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 py-12 px-6 flex flex-col items-center" style={{ paddingTop: '96px' }}>
        {/* Search Box at top */}
        <div className="w-full max-w-[680px] mb-8" style={{ animation: 'fadeUp 0.5s 0.1s both' }}>
          <form onSubmit={handleVerify}>
            <div
              className="flex overflow-hidden rounded-xl transition-all"
              style={{
                background: 'white',
                border: '1.5px solid #D0E4E4',
                boxShadow: '0 2px 12px rgba(45,106,106,0.07)',
              }}
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                placeholder="Enter Certificate ID — e.g. SME-CERT-E099E930"
                className="flex-1 border-none outline-none py-3.5 px-5 text-[15px] tracking-[0.02em]"
                style={{ color: '#1A2A2A', background: 'transparent' }}
              />
              <button
                type="submit"
                className="px-6 text-sm font-semibold whitespace-nowrap transition-colors"
                style={{ background: '#2D6A6A', color: 'white', border: 'none' }}
              >
                Verify
              </button>
            </div>
          </form>
        </div>

        {/* Certificate Document */}
        <div
          className="w-full max-w-[680px] rounded-2xl overflow-hidden"
          style={{ background: 'white', boxShadow: '0 8px 40px rgba(45,106,106,0.12)', animation: 'fadeUp 0.6s 0.2s both' }}
        >
          {/* Certificate Header */}
          <div className="relative overflow-hidden" style={{ background: config.headerBg }}>
            {/* Decorative corner shape */}
            <div
              className="absolute top-0 right-0 w-[200px] h-[200px]"
              style={{
                background: config.headerAccent,
                borderRadius: '0 0 0 100%',
                opacity: 0.3,
              }}
            />

            <div className="relative z-10 p-8 pb-7">
              {/* Top row */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-[15px]">Naywa</p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>SME Certification Registry</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Certificate Type
                  </p>
                  <p className="text-sm font-semibold" style={{ color: config.headerAccent }}>
                    SME Capital-Readiness
                  </p>
                </div>
              </div>

              {/* Title */}
              <h1
                className="text-[clamp(24px,4vw,32px)] font-bold leading-[1.15] tracking-[-0.01em] text-white mb-1"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}
              >
                Certificate of SME Certification
              </h1>

              <div className="flex items-center justify-between">
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}></p>
                <div className="text-right">
                  <p className="text-[9px] font-semibold tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Issued</p>
                  <p className="text-sm font-semibold" style={{ color: config.headerAccent }}>{formatDate(certificate.issuedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="p-8 pt-7">
            {/* Description */}
            <p className="text-[13px] leading-[1.7] mb-7" style={{ color: '#5A7070' }}>
              This certificate attests that the entity named below has successfully completed the Naywa SME certification process and meets the documentation and governance standards required for capital readiness assessment.
            </p>

            {/* Entity Name */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-2" style={{ color: '#2D6A6A' }}>
                Entity Name
              </p>
              <p
                className="text-[clamp(28px,5vw,36px)] font-bold leading-[1.1] tracking-[-0.01em] pb-3"
                style={{
                  fontFamily: 'var(--font-playfair), Playfair Display, serif',
                  color: '#111C1C',
                  borderBottom: '3px solid #2D6A6A',
                  display: 'inline-block',
                }}
              >
                {certificate.companyName}
              </p>
            </div>

            {/* Trade License & Sector */}
            <div className="grid grid-cols-2 gap-6 mb-7">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                  Trade License Number
                </p>
                <p className="text-[15px] font-semibold" style={{ color: '#111C1C' }}>
                  {certificate.tradeLicenseNumber}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                  Industry Sector
                </p>
                <p className="text-[15px] font-semibold" style={{ color: '#111C1C' }}>
                  {certificate.industrySector}
                </p>
              </div>
            </div>

            {/* Certificate Info Box */}
            <div
              className="rounded-xl p-5 mb-7"
              style={{ background: '#F8FBFB', borderLeft: '4px solid #2D6A6A' }}
            >
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Certificate ID
                  </p>
                  <p className="text-[12px] font-semibold tracking-wide" style={{ color: '#111C1C', fontFamily: 'monospace' }}>
                    {certificate.certificateId}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Version
                  </p>
                  <p className="text-[13px] font-semibold" style={{ color: '#111C1C' }}>
                    {certificate.version || 'v1.0'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Issue Date
                  </p>
                  <p className="text-[13px] font-semibold" style={{ color: '#111C1C' }}>
                    {formatDate(certificate.issuedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Expiry Date
                  </p>
                  <p className="text-[13px] font-semibold" style={{ color: '#111C1C' }}>
                    {formatDate(certificate.expiresAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Status
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full"
                    style={{ background: config.bgColor, color: config.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
                    {config.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Pillars Assessed */}
            <div className="mb-7">
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: '#5A7070' }}>
                  Pillars Assessed
                </p>
                <div className="flex-1 h-[1px]" style={{ background: '#E0EBEB' }} />
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {pillars.map((pillar, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <p className="text-[13px]" style={{ color: '#1A2A2A' }}>{pillar}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Box */}
            <div
              className="rounded-xl p-5"
              style={{ background: '#F0F7F7' }}
            >
              <div className="flex gap-6">
                {/* QR Code */}
                <div className="flex-shrink-0">
                  <div
                    className="w-[100px] h-[100px] rounded-lg flex items-center justify-center p-2"
                    style={{ background: 'white', border: '1px solid #D0E4E4' }}
                  >
                    <QRCodeSVG
                      value={verificationUrl}
                      size={84}
                      level="M"
                      fgColor="#111C1C"
                      bgColor="white"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: '#5A7070' }}>
                      Verification Hash
                    </p>
                    <p className="text-[12px] font-medium break-all" style={{ color: '#1A2A2A', fontFamily: 'monospace' }}>
                      {certificate.verificationHash}
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: '#5A7070' }}>
                      This hash uniquely identifies the certificate and supports integrity verification.
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: '#5A7070' }}>
                      Verification URL
                    </p>
                    <a
                      href={verificationUrl}
                      className="text-[12px] font-medium break-all no-underline hover:underline"
                      style={{ color: '#2D6A6A' }}
                    >
                      {verificationUrl}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="relative overflow-hidden" style={{ background: '#2D6A6A' }}>
            <div className="p-6 flex items-center justify-between gap-4">
              <p className="text-[10px] leading-[1.7] max-w-[460px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Digitally issued via Naywa Registry. This document is electronically generated and does not require a physical signature. Certification reflects assessment based on documentation at time of review. Verification confirms status recorded in Naywa&apos;s certification register at time of query.
              </p>
              <div
                className="flex-shrink-0 px-4 py-2.5 rounded-lg text-right"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <p className="text-[11px] font-bold tracking-[0.08em] text-white">NAYWA CERTIFIED</p>
                <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Digital Verification Seal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verify Another */}
        <div className="mt-8 text-center">
          <Link
            href="/registry/verify"
            className="inline-flex items-center gap-2 text-[13px] font-medium no-underline transition-all hover:gap-3"
            style={{ color: '#2D6A6A' }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Verify another certificate
          </Link>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
