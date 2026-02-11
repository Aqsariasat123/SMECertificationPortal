'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CertificateVerification } from '@/types';

// State configuration for different certificate statuses
const stateConfig = {
  active: {
    bannerClass: 'active',
    iconStroke: '#1A6B3C',
    iconPath: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
    label: 'Certification Status',
    badge: 'Active',
    desc: "This certificate is active and recorded in Naywa's certification register.",
    headerBg: '#111C1C',
    bannerBg: '#E6F4ED',
    bannerBorder: 'rgba(26,107,60,0.2)',
    iconBg: 'rgba(26,107,60,0.12)',
    labelColor: '#1A6B3C',
    badgeBg: 'rgba(26,107,60,0.12)',
  },
  expired: {
    bannerClass: 'expired',
    iconStroke: '#92620A',
    iconPath: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    label: 'Certification Expired',
    badge: 'Expired',
    desc: 'Certificate has expired as of', // Date will be appended dynamically
    headerBg: '#111C1C',
    bannerBg: '#FDF3E3',
    bannerBorder: 'rgba(146,98,10,0.2)',
    iconBg: 'rgba(146,98,10,0.12)',
    labelColor: '#92620A',
    badgeBg: 'rgba(146,98,10,0.12)',
  },
  revoked: {
    bannerClass: 'revoked',
    iconStroke: '#8B2020',
    iconPath: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    label: 'Certificate Revoked',
    badge: 'Revoked',
    desc: 'This certificate has been revoked.',
    headerBg: '#2A1515',
    bannerBg: '#FAEAEA',
    bannerBorder: 'rgba(139,32,32,0.25)',
    iconBg: 'rgba(139,32,32,0.12)',
    labelColor: '#8B2020',
    badgeBg: 'rgba(139,32,32,0.15)',
  },
  deferred: {
    bannerClass: 'deferred',
    iconStroke: '#92620A',
    iconPath: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    label: 'Certification Deferred',
    badge: 'Deferred',
    desc: 'Certification review incomplete. Status: Deferred.',
    headerBg: '#111C1C',
    bannerBg: '#FDF3E3',
    bannerBorder: 'rgba(146,98,10,0.2)',
    iconBg: 'rgba(146,98,10,0.12)',
    labelColor: '#92620A',
    badgeBg: 'rgba(146,98,10,0.12)',
  },
};

const notFoundConfig = {
  iconStroke: '#5A7070',
  iconPath: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  label: 'No Record Found',
  badge: 'Not Found',
  desc: 'No certificate record found matching this ID.',
  bannerBg: '#F5FAFA',
  bannerBorder: '#D0E4E4',
  iconBg: 'rgba(90,112,112,0.1)',
  labelColor: '#5A7070',
  badgeBg: 'rgba(90,112,112,0.1)',
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

  // Not Found state
  if (error || !certificate) {
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
            <p className="text-xs text-center mb-3 leading-[1.5]" style={{ color: '#5A7070' }}>
              Verification confirms the current status recorded in Naywa&apos;s certification register.
            </p>
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
                  style={{
                    fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                    color: '#1A2A2A',
                    background: 'transparent',
                  }}
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
            <p className="text-[11px] text-center mt-2.5 tracking-[0.02em]" style={{ color: '#5A7070' }}>
              Verification is available to any party. No account required.
            </p>
          </div>

          {/* Result */}
          <div className="w-full max-w-[680px]" style={{ animation: 'fadeUp 0.6s 0.3s both' }}>
            {/* Status Banner */}
            <div
              className="flex items-center gap-3.5 p-4 px-6 rounded-t-xl"
              style={{
                background: notFoundConfig.bannerBg,
                border: `1px solid ${notFoundConfig.bannerBorder}`,
                borderBottom: 'none',
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: notFoundConfig.iconBg }}
              >
                <svg
                  className="w-[18px] h-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={notFoundConfig.iconStroke}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: notFoundConfig.iconPath }}
                />
              </div>
              <div className="flex-1">
                <p
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-0.5"
                  style={{ color: notFoundConfig.labelColor }}
                >
                  {notFoundConfig.label}
                </p>
                <p className="text-[13px] leading-[1.4]" style={{ color: '#5A7070' }}>
                  {notFoundConfig.desc}
                </p>
              </div>
              <span
                className="text-[11px] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full whitespace-nowrap"
                style={{ background: notFoundConfig.badgeBg, color: notFoundConfig.labelColor }}
              >
                {notFoundConfig.badge}
              </span>
            </div>

            {/* Not Found Card */}
            <div
              className="rounded-b-2xl p-[52px_36px] text-center"
              style={{ background: 'white', border: '1px solid #D0E4E4', borderTop: 'none' }}
            >
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: '#F5FAFA' }}
              >
                <svg
                  className="w-[22px] h-[22px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5A7070"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p
                className="text-[22px] font-bold mb-2.5"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                No Record Found
              </p>
              <p className="text-sm leading-[1.7] max-w-[360px] mx-auto mb-6" style={{ color: '#5A7070' }}>
                No certificate record found matching this ID. Please check the ID and try again.
              </p>
              <span
                className="inline-block text-xs px-5 py-3 rounded-lg"
                style={{ color: '#5A7070', background: '#F5FAFA', border: '1px solid #D0E4E4' }}
              >
                Certificate IDs follow the format: SME-CERT-XXXXXXXX
              </span>
            </div>

            {/* Verify Another */}
            <div className="mt-6 text-center">
              <Link
                href="/registry/verify"
                className="inline-flex items-center gap-2 text-[13px] font-medium no-underline transition-all hover:gap-3"
                style={{ color: '#2D6A6A' }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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

  // Get status config
  const status = certificate.status as keyof typeof stateConfig;
  const config = stateConfig[status] || stateConfig.active;

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
          <p className="text-xs text-center mb-3 leading-[1.5]" style={{ color: '#5A7070' }}>
            Verification confirms the current status recorded in Naywa&apos;s certification register.
          </p>
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
                style={{
                  fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                  color: '#1A2A2A',
                  background: 'transparent',
                }}
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
          <p className="text-[11px] text-center mt-2.5 tracking-[0.02em]" style={{ color: '#5A7070' }}>
            Verification is available to any party. No account required.
          </p>
        </div>

        {/* Result */}
        <div className="w-full max-w-[680px]" style={{ animation: 'fadeUp 0.6s 0.3s both' }}>
          {/* Status Banner */}
          <div
            className="flex items-center gap-3.5 p-4 px-6 rounded-t-xl"
            style={{
              background: config.bannerBg,
              border: `1px solid ${config.bannerBorder}`,
              borderBottom: 'none',
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: config.iconBg }}
            >
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke={config.iconStroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: config.iconPath }}
              />
            </div>
            <div className="flex-1">
              <p
                className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-0.5"
                style={{ color: config.labelColor }}
              >
                {config.label}
              </p>
              <p className="text-[13px] leading-[1.4]" style={{ color: '#5A7070' }}>
                {status === 'expired' ? `${config.desc} ${formatDate(certificate.expiresAt)}.` : config.desc}
              </p>
            </div>
            <span
              className="text-[11px] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{ background: config.badgeBg, color: config.labelColor }}
            >
              {config.badge}
            </span>
          </div>

          {/* Certificate Card */}
          <div
            className="rounded-b-2xl overflow-hidden"
            style={{ background: 'white', border: '1px solid #D0E4E4', borderTop: 'none', boxShadow: '0 4px 32px rgba(45,106,106,0.08)' }}
          >
            {/* Card Header */}
            <div
              className="p-8 px-9 relative overflow-hidden"
              style={{ background: config.headerBg }}
            >
              {/* Gradient overlay */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '-80px',
                  right: '-80px',
                  width: '280px',
                  height: '280px',
                  background: 'radial-gradient(ellipse, rgba(45,106,106,0.2) 0%, transparent 65%)',
                }}
              />

              <div className="flex items-center justify-between relative z-10">
                <div>
                  {/* Issuer */}
                  <div className="flex items-center gap-2.5 mb-5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: '#2D6A6A' }}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <polyline points="9 12 11 14 15 10"/>
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold tracking-[0.04em]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Naywa Certification
                    </span>
                  </div>
                  {/* Company Name */}
                  <p
                    className="text-[clamp(22px,3vw,30px)] font-bold leading-[1.1] tracking-[-0.01em]"
                    style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: 'white' }}
                  >
                    {certificate.companyName}
                  </p>
                </div>

                <div className="text-right relative z-10">
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Certificate Type
                  </p>
                  <p className="text-sm font-semibold" style={{ color: '#3D8B8B' }}>
                    SME Capital-Readiness
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="px-9">
              {/* Meta Grid */}
              <div className="grid grid-cols-2" style={{ borderBottom: '1px solid #D0E4E4' }}>
                <div className="py-[22px] pr-7" style={{ borderRight: '1px solid #D0E4E4' }}>
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Certificate ID
                  </p>
                  <p
                    className="text-[13px] font-medium tracking-[0.04em]"
                    style={{ fontFamily: "'Libre Baskerville', serif", color: '#1A2A2A' }}
                  >
                    {certificate.certificateId}
                  </p>
                </div>
                <div className="py-[22px] pl-7">
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Certification Status
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full"
                    style={{ background: config.badgeBg, color: config.labelColor }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                    {config.badge}
                  </span>
                </div>
                <div className="py-[22px] pr-7" style={{ borderRight: '1px solid #D0E4E4', borderTop: '1px solid #D0E4E4' }}>
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Issue Date
                  </p>
                  <p className="text-[15px] font-medium leading-[1.3]" style={{ color: '#1A2A2A' }}>
                    {formatDate(certificate.issuedAt)}
                  </p>
                </div>
                <div className="py-[22px] pl-7" style={{ borderTop: '1px solid #D0E4E4' }}>
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Expiry Date
                  </p>
                  <p className="text-[15px] font-medium leading-[1.3]" style={{ color: '#1A2A2A' }}>
                    {formatDate(certificate.expiresAt)}
                  </p>
                </div>
                <div className="py-[22px] pr-7" style={{ borderRight: '1px solid #D0E4E4', borderTop: '1px solid #D0E4E4' }}>
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Sector
                  </p>
                  <p className="text-[15px] font-medium leading-[1.3]" style={{ color: '#1A2A2A' }}>
                    {certificate.industrySector}
                  </p>
                </div>
                <div className="py-[22px] pl-7" style={{ borderTop: '1px solid #D0E4E4' }}>
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: '#5A7070' }}>
                    Jurisdiction
                  </p>
                  <p className="text-[15px] font-medium leading-[1.3]" style={{ color: '#1A2A2A' }}>
                    United Arab Emirates
                  </p>
                </div>
              </div>

              {/* Pillars Assessed */}
              <div className="py-[22px]" style={{ borderBottom: '1px solid #D0E4E4' }}>
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3.5" style={{ color: '#5A7070' }}>
                  Pillars Assessed
                </p>
                <div className="flex flex-col gap-2.5">
                  {pillars.map((pillar, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: '#E6F4ED' }}
                      >
                        <svg
                          className="w-2.5 h-2.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1A6B3C"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <p className="text-[13px] font-medium" style={{ color: '#1A2A2A' }}>
                        {pillar}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div
              className="px-9 py-[18px] flex items-center justify-between gap-4"
              style={{ background: '#F5FAFA', borderTop: '1px solid #D0E4E4' }}
            >
              <p className="text-[11px] leading-[1.6] max-w-[480px]" style={{ color: '#5A7070' }}>
                This record reflects the certification status at the time of verification. Certification does not constitute regulatory approval or a guarantee of financing.
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: '#E8F4F4' }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2D6A6A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <span className="text-[11px] font-semibold tracking-[0.04em]" style={{ color: '#2D6A6A' }}>
                  Certificate Record Verified
                </span>
              </div>
            </div>
          </div>

          {/* Verify Another */}
          <div className="mt-6 text-center">
            <Link
              href="/registry/verify"
              className="inline-flex items-center gap-2 text-[13px] font-medium no-underline transition-all hover:gap-3"
              style={{ color: '#2D6A6A' }}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
