import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mark UI Creative — Premium Creative Studio',
    template: '%s | Mark UI Creative',
  },
  description:
    'Mark UI Creative is a premium creative studio crafting brands, interfaces, and digital experiences that leave lasting impressions.',
  keywords: ['creative studio', 'branding', 'UI/UX design', 'motion design', 'web design', 'Sri Lanka'],
  authors: [{ name: 'Mark UI', url: 'https://markui.lk' }],
  creator: 'Mark UI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://creative.markui.lk'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://creative.markui.lk',
    siteName: 'Mark UI Creative',
    title: 'Mark UI Creative — Premium Creative Studio',
    description: 'Premium creative studio crafting brands, interfaces, and digital experiences.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mark UI Creative',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mark UI Creative',
    description: 'Premium creative studio crafting brands, interfaces, and digital experiences.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
