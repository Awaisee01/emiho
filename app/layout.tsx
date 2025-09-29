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
  icons: {
    icon: '/favicon.ico', // <-- place your favicon file in the public folder
    shortcut: '/favicon.ico', // optional
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
