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

        {/* Certificate Document - Matching PDF Layout */}
        <div className="w-full max-w-[680px] rounded-xl overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

          {/* HEADER - Dark teal with curved corner */}
          <div className="relative overflow-hidden" style={{ background: '#2D6A6A', padding: '28px 32px 24px' }}>
            {/* Curved corner decoration */}
            <div className="absolute top-0 right-0" style={{ width: '200px', height: '200px', background: '#5DB5A8', borderRadius: '0 0 0 100%', opacity: 0.15 }} />

            <div className="relative z-10 flex justify-between items-start">
              {/* Left: Logo + Title */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-[16px] tracking-wide">Naywa</p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>SME Certification Registry</p>
                  </div>
                </div>
                <h1 className="text-[26px] font-bold leading-tight" style={{ color: '#5DB5A8', fontFamily: 'var(--font-playfair), Playfair Display, serif' }}>
                  Certificate of SME Certification
                </h1>
              </div>

              {/* Right: Certificate Type + Issue Date */}
              <div className="text-right">
                <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>CERTIFICATE TYPE</p>
                <p className="text-[13px] font-semibold mb-4" style={{ color: '#5DB5A8' }}>SME Capital-Readiness</p>
                <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>ISSUED</p>
                <p className="text-[14px] font-semibold text-white">{formatDate(certificate.issuedAt)}</p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="p-7 md:p-8">
            {/* Determination Statement */}
            <p className="text-[12px] leading-[1.8] mb-7" style={{ color: '#5A7070' }}>
              This document confirms that the entity identified below has completed Naywa&apos;s independent, documentation-based assessment and met the structured criteria defined under the SME Capital-Readiness Framework at the time of determination.
            </p>

            {/* Entity Name - Large with underline */}
            <div className="mb-6">
              <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-2" style={{ color: '#2D6A6A' }}>ENTITY NAME</p>
              <p className="text-[32px] font-bold leading-tight pb-2" style={{ color: '#111C1C', fontFamily: 'var(--font-playfair), Playfair Display, serif', borderBottom: '2px solid #2D6A6A' }}>
                {certificate.companyName}
              </p>
            </div>

            {/* Trade License + Industry Sector Row */}
            <div className="grid grid-cols-2 gap-6 mb-7">
              <div>
                <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: '#5A7070' }}>TRADE LICENSE NUMBER</p>
                <p className="text-[16px] font-semibold" style={{ color: '#111C1C' }}>{certificate.tradeLicenseNumber}</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: '#5A7070' }}>INDUSTRY SECTOR</p>
                <p className="text-[16px] font-semibold" style={{ color: '#111C1C' }}>{certificate.industrySector}</p>
              </div>
            </div>

            {/* Certificate Info Box with left border */}
            <div className="mb-7 rounded-lg overflow-hidden" style={{ border: '1px solid #E8F0F0' }}>
              <div className="flex" style={{ borderLeft: '4px solid #2D6A6A' }}>
                <div className="flex-1 p-4" style={{ borderRight: '1px solid #E8F0F0' }}>
                  <p className="text-[8px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#5A7070' }}>CERTIFICATE ID</p>
                  <p className="text-[13px] font-semibold font-mono" style={{ color: '#111C1C' }}>{certificate.certificateId}</p>
                </div>
                <div className="p-4" style={{ borderRight: '1px solid #E8F0F0', minWidth: '80px' }}>
                  <p className="text-[8px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#5A7070' }}>VERSION</p>
                  <p className="text-[13px] font-semibold" style={{ color: '#111C1C' }}>v{certificate.version || '1.0'}</p>
                </div>
                <div className="p-4" style={{ borderRight: '1px solid #E8F0F0' }}>
                  <p className="text-[8px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#5A7070' }}>ISSUE DATE</p>
                  <p className="text-[13px] font-semibold" style={{ color: '#111C1C' }}>{formatDate(certificate.issuedAt)}</p>
                </div>
                <div className="p-4" style={{ borderRight: '1px solid #E8F0F0' }}>
                  <p className="text-[8px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#5A7070' }}>EXPIRY DATE</p>
                  <p className="text-[13px] font-semibold" style={{ color: '#111C1C' }}>{formatDate(certificate.expiresAt)}</p>
                </div>
                <div className="p-4">
                  <p className="text-[8px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#5A7070' }}>STATUS</p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color: config.color }}>
                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: config.color }} />
                    {config.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Pillars Assessed */}
            <div className="mb-7">
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[9px] font-semibold tracking-[0.1em] uppercase" style={{ color: '#5A7070' }}>PILLARS ASSESSED</p>
                <div className="flex-1 h-[1px]" style={{ background: '#E8F0F0' }} />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {pillarsLeft.map((pillar, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <p className="text-[12px]" style={{ color: '#111C1C' }}>{pillar}</p>
                  </div>
                ))}
                {pillarsRight.map((pillar, i) => (
                  <div key={`r-${i}`} className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <p className="text-[12px]" style={{ color: '#111C1C' }}>{pillar}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Box - Light teal background */}
            <div className="mb-7 p-5 rounded-lg" style={{ background: '#F5FAFA' }}>
              <div className="flex gap-5">
                <div className="flex-1">
                  <div className="mb-4">
                    <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#5A7070' }}>VERIFICATION HASH</p>
                    <p className="font-mono text-[12px] mb-1" style={{ color: '#111C1C' }}>{certificate.verificationHash}</p>
                    <p className="text-[10px]" style={{ color: '#5A7070' }}>This cryptographic hash uniquely identifies the certificate and supports integrity verification.</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#5A7070' }}>VERIFICATION URL</p>
                    <a href={verificationUrl} className="text-[11px] break-all" style={{ color: '#2D6A6A' }}>{verificationUrl}</a>
                  </div>
                </div>
                {/* QR Code */}
                <div className="flex-shrink-0">
                  <QRCodeSVG value={verificationUrl} size={80} />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER - Dark teal bar */}
          <div className="relative px-7 py-5 flex items-center justify-between" style={{ background: '#2D6A6A' }}>
            <p className="text-[10px] leading-[1.7] max-w-[480px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Digitally issued via Naywa Registry. This document is electronically generated and does not require a physical signature. Certification reflects assessment based on documentation at time of review. Verification confirms status recorded in Naywa&apos;s certification register at time of query.
            </p>
            {/* Seal */}
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-[12px] font-bold" style={{ color: '#5DB5A8' }}>NAYWA CERTIFIED</p>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Digital Verification Mark</p>
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
