import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Emiho - Preserve Love, Share Legacy',
  description: 'Create beautiful digital memorials, share precious stories, and build communities around the memories that matter most.',
  keywords: 'memorial, legacy, stories, community, digital tribute, memory preservation',
  authors: [{ name: 'Emiho Team', url: 'https://emiho.org' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Emiho - Preserve Love, Share Legacy',
    description: 'Create beautiful digital memorials, share precious stories, and build communities around the memories that matter most.',
    url: 'https://emiho.org',
    siteName: 'Emiho',
    images: [
      {
        url: 'https://emiho.org/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Emiho - Digital Memorials',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emiho - Preserve Love, Share Legacy',
    description: 'Create beautiful digital memorials, share precious stories, and build communities around the memories that matter most.',
    images: ['https://emiho.org/og-image.png'],
    creator: '@EmihoOfficial',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
