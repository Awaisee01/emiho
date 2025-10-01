import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true });

export const metadata: Metadata = {
  metadataBase: new URL("https://emiho.org"), // ✅ fixes the warning
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
        url: '/og-image.png', // relative path works now because metadataBase is set
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
    images: ['/og-image.png'], // relative path okay now
    creator: '@EmihoOfficial',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
