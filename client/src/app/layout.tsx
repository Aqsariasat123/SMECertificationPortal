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
  themeColor: '#2D6A6A',
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
      <body className={`${inter.variable} ${playfair.variable} ${dmSans.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
