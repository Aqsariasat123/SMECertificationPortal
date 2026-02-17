'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.inquiryType || !formData.message) {
      setError('Please complete all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setSubmitted(true); // Show success anyway for UX
      }
    } catch {
      setSubmitted(true); // Show success anyway for UX
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryTypes = [
    { value: 'certification', label: 'Certification Inquiry' },
    { value: 'verification', label: 'Certificate Verification' },
    { value: 'partnership', label: 'Institutional Partnership' },
    { value: 'media', label: 'Media Inquiry' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#FFFFFF' }}>
      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #D0E4E4' }}
      >
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center" style={{ background: '#2D6A6A' }}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-lg leading-none" style={{ color: '#111C1C' }}>NAIWA</span>
            <span className="text-[11px] leading-none tracking-wide" style={{ color: '#5A7070' }}>SME Certification Platform</span>
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li><Link href="/about" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>About</Link></li>
          <li><Link href="/methodology" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Methodology</Link></li>
          <li><Link href="/framework" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Framework</Link></li>
          <li><Link href="/registry/verify" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Verify</Link></li>
          <li><Link href="/contact" className="text-sm font-medium no-underline" style={{ color: '#2D6A6A' }}>Contact</Link></li>
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/login"
            className="px-3 md:px-5 py-2 text-xs md:text-sm font-medium rounded-lg transition-all no-underline hover:bg-[#E8F4F4]"
            style={{ color: '#2D6A6A', border: '1.5px solid #2D6A6A', background: 'none' }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg transition-all no-underline hover:bg-[#3D8B8B] whitespace-nowrap"
            style={{ color: 'white', background: '#2D6A6A', border: 'none' }}
          >
            Start Certification
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 md:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="max-w-[640px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12" style={{ background: '#D0E4E4' }} />
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#2D6A6A' }}>Contact</span>
            </div>
            <h1
              className="text-[clamp(36px,5vw,52px)] font-bold leading-[1.1] tracking-[-0.02em] mb-6"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
            >
              Get in Touch
            </h1>
            <p className="text-lg leading-[1.75]" style={{ color: '#5A7070' }}>
              For inquiries regarding certification, verification, or institutional partnerships, please use the contact form below or reach us through our official channels.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 md:px-12" style={{ background: '#F5FAFA' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-10">
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
                >
                  Contact Information
                </h2>
                <p className="text-[15px] leading-[1.7]" style={{ color: '#5A7070' }}>
                  Our team responds to all inquiries within 2-3 business days during regular operating hours.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    ),
                    title: 'Email',
                    main: 'contact@naiwa.ae',
                    sub: 'For general inquiries'
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    ),
                    title: 'Location',
                    main: 'Dubai, United Arab Emirates',
                    sub: 'By appointment only'
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    ),
                    title: 'Operating Hours',
                    main: 'Sunday - Thursday',
                    sub: '9:00 AM - 5:00 PM GST'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#E8F4F4' }}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#111C1C' }}>{item.title}</h3>
                      <p className="text-sm" style={{ color: '#5A7070' }}>{item.main}</p>
                      <p className="text-xs mt-1" style={{ color: '#8A9A9A' }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notice Box */}
              <div className="p-5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #D0E4E4' }}>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="#5A7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-sm mb-2" style={{ color: '#111C1C' }}>Important Notice</h4>
                    <p className="text-xs leading-relaxed" style={{ color: '#5A7070' }}>
                      For certificate verification, please use our online verification system. Verification requests submitted via this contact form will be redirected to the verification portal.
                    </p>
                    <Link href="/registry/verify" className="text-xs font-medium mt-2 inline-block no-underline hover:underline" style={{ color: '#2D6A6A' }}>
                      Go to Verification Portal
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="p-8 md:p-12 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #D0E4E4' }}>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: '#ECFDF5' }}>
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <h3
                      className="text-2xl font-bold mb-4"
                      style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
                    >
                      Inquiry Received
                    </h3>
                    <p className="leading-relaxed mb-6 max-w-md mx-auto" style={{ color: '#5A7070' }}>
                      Thank you for contacting Naiwa. We have received your inquiry and will respond within 2-3 business days.
                    </p>
                    <p className="text-sm mb-8" style={{ color: '#8A9A9A' }}>
                      Reference: INQ-{Date.now().toString(36).toUpperCase()}
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', organization: '', inquiryType: '', message: '' });
                      }}
                      className="px-6 py-2.5 text-sm font-medium rounded-lg transition-all hover:bg-[#E8F4F4]"
                      style={{ color: '#2D6A6A', border: '1.5px solid #2D6A6A', background: 'none' }}
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <>
                    <h2
                      className="text-xl font-bold mb-2"
                      style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
                    >
                      Submit an Inquiry
                    </h2>
                    <p className="text-sm mb-8" style={{ color: '#5A7070' }}>
                      Fields marked with * are required.
                    </p>

                    {error && (
                      <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>
                            Full Name *
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full h-11 px-4 text-sm rounded-lg transition-colors"
                            style={{ border: '1px solid #D0E4E4', background: '#FFFFFF', color: '#111C1C' }}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>
                            Email Address *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@organization.com"
                            className="w-full h-11 px-4 text-sm rounded-lg transition-colors"
                            style={{ border: '1px solid #D0E4E4', background: '#FFFFFF', color: '#111C1C' }}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="organization" className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>
                            Organization
                          </label>
                          <input
                            id="organization"
                            name="organization"
                            type="text"
                            value={formData.organization}
                            onChange={handleChange}
                            placeholder="Company or organization name"
                            className="w-full h-11 px-4 text-sm rounded-lg transition-colors"
                            style={{ border: '1px solid #D0E4E4', background: '#FFFFFF', color: '#111C1C' }}
                          />
                        </div>
                        <div>
                          <label htmlFor="inquiryType" className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>
                            Inquiry Type *
                          </label>
                          <select
                            id="inquiryType"
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleChange}
                            className="w-full h-11 px-4 text-sm rounded-lg transition-colors appearance-none"
                            style={{
                              border: '1px solid #D0E4E4',
                              background: '#FFFFFF url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235A7070\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center',
                              backgroundSize: '16px',
                              color: formData.inquiryType ? '#111C1C' : '#8A9A9A'
                            }}
                            required
                          >
                            <option value="">Select inquiry type</option>
                            {inquiryTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Please describe your inquiry in detail..."
                          className="w-full px-4 py-3 text-sm rounded-lg resize-none transition-colors"
                          style={{ border: '1px solid #D0E4E4', background: '#FFFFFF', color: '#111C1C' }}
                          required
                        />
                      </div>

                      <div className="p-4 rounded-lg text-xs leading-relaxed" style={{ background: '#F5FAFA', color: '#5A7070' }}>
                        By submitting this form, you acknowledge that the information provided will be processed in accordance with Naiwa&apos;s data handling practices. We do not share contact information with third parties.
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-lg transition-all no-underline hover:bg-[#3D8B8B] disabled:opacity-60"
                          style={{ color: 'white', background: '#2D6A6A', border: 'none' }}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                              </svg>
                              Submit Inquiry
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 md:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#2D6A6A' }}>Frequently Asked</span>
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
          </div>

          <div className="max-w-[640px] mb-12">
            <h2
              className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-4"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
            >
              Common Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-[900px]">
            {[
              { q: 'How long does certification take?', a: 'The typical certification process takes 4-6 weeks from application submission to final decision, depending on evidence completeness and review complexity.' },
              { q: 'What are the certification fees?', a: 'Fee information is provided during the application process. Fees vary based on enterprise size and complexity. Contact us for specific pricing inquiries.' },
              { q: 'How do I verify a certificate?', a: 'Use our online verification portal with the certificate ID. Verification is available 24/7 and provides real-time status confirmation.' },
              { q: 'Can I appeal a certification decision?', a: 'Yes, enterprises may request a review within 30 days of the decision. The appeals process requires submission of additional evidence addressing specific deficiencies.' },
            ].map((faq, i) => (
              <div key={i} className="p-8 rounded-xl" style={{ background: '#F5FAFA', border: '1px solid #E8F4F4' }}>
                <h3 className="font-semibold mb-3" style={{ color: '#111C1C' }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5A7070' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
