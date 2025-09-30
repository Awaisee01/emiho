import EventsPage from '@/components/pagess/Events'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Emiho - Events',
  description: 'Discover and join meaningful events on Emiho. Preserve memories and connect with stories.',
  openGraph: {
    title: 'Emiho - Events',
    description: 'Discover and join meaningful events on Emiho. Preserve memories and connect with stories.',
    url: 'https://emiho.org/events',
    siteName: 'Emiho',
    images: [
      {
        url: 'https://emiho.org/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Emiho Events'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emiho - Events',
    description: 'Discover and join meaningful events on Emiho. Preserve memories and connect with stories.',
    images: ['https://emiho.org/og-image.png'],
  },
}

const page = () => {
  return (
    <div>
      <EventsPage/>
    </div>
  )
}

export default page
