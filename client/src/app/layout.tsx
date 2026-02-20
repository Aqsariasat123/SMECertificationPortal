import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-source-sans',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1A2F2F',
};

export const metadata: Metadata = {
  title: {
    default: 'Naiwa – SME Readiness & Certification Platform',
    template: '%s | Naiwa',
  },
  description: 'Naiwa – UAE SME Readiness & Certification Platform. Get certified, gain credibility, and access new opportunities. Trusted by businesses across the UAE.',
  keywords: ['Naiwa', 'SME certification', 'UAE business', 'business certification', 'SME registry', 'registry access', 'business credibility'],
  authors: [{ name: 'Naiwa' }],
  creator: 'Naiwa',
  publisher: 'Naiwa',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    siteName: 'Naiwa',
    title: 'Naiwa – SME Readiness & Certification Platform',
    description: 'Naiwa – UAE SME Readiness & Certification Platform. Get certified and access opportunities',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naiwa – SME Readiness & Certification Platform',
    description: 'Naiwa – UAE SME Readiness & Certification Platform. Get certified and access opportunities',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${sourceSans.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
