import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: {
    default: 'Naywa – SME Readiness & Certification Platform',
    template: '%s | Naywa',
  },
  description: 'Naywa – UAE SME Readiness & Certification Platform. Get certified, gain credibility, and access new opportunities. Trusted by businesses across the UAE.',
  keywords: ['Naywa', 'SME certification', 'UAE business', 'business certification', 'SME registry', 'registry access', 'business credibility'],
  authors: [{ name: 'Naywa' }],
  creator: 'Naywa',
  publisher: 'Naywa',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    siteName: 'Naywa',
    title: 'Naywa – SME Readiness & Certification Platform',
    description: 'Naywa – UAE SME Readiness & Certification Platform. Get certified and access opportunities',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naywa – SME Readiness & Certification Platform',
    description: 'Naywa – UAE SME Readiness & Certification Platform. Get certified and access opportunities',
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
      <body className={`${inter.variable} ${playfair.variable} ${dmSans.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
