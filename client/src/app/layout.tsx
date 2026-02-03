import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: {
    default: 'SME Certification Portal',
    template: '%s | SME Certification Portal',
  },
  description: 'UAE SME Readiness Certification Portal - Get certified, gain credibility, and access new opportunities. Trusted by businesses across the UAE.',
  keywords: ['SME certification', 'UAE business', 'business certification', 'SME registry', 'registry access', 'business credibility'],
  authors: [{ name: 'SME Certification Portal' }],
  creator: 'SME Certification Portal',
  publisher: 'SME Certification Portal',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    siteName: 'SME Certification Portal',
    title: 'SME Certification Portal',
    description: 'UAE SME Readiness Certification Portal - Get certified and access opportunities',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SME Certification Portal',
    description: 'UAE SME Readiness Certification Portal - Get certified and access opportunities',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
