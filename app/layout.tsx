import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://benchmarkequip.com'),
  title: {
    default: 'Benchmark Equipment Rental & Sales - Professional Equipment Rental',
    template: '%s | Benchmark Equipment'
  },
  description: 'Driven by Relationships, Powered by Reliability. Professional equipment rental and sales in Denton, TX. Excavators, loaders, skid steers, water trucks, and more. Call (817) 403-4334',
  keywords: ['equipment rental', 'construction equipment', 'excavator rental', 'skid steer rental', 'water truck rental', 'Denton TX', 'construction rental', 'heavy equipment'],
  authors: [{ name: 'Benchmark Equipment' }],
  creator: 'Benchmark Equipment',
  publisher: 'Benchmark Equipment',
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://benchmarkequip.com/',
    siteName: 'Benchmark Equipment',
    title: 'Benchmark Equipment Rental & Sales - Professional Equipment Rental',
    description: 'Driven by Relationships, Powered by Reliability. Professional equipment rental and sales in Denton, TX.',
    images: [
      {
        url: '/assets/Cat%20336.jpeg',
        width: 1200,
        height: 630,
        alt: 'Benchmark Equipment - Cat 336 Excavator',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benchmark Equipment Rental & Sales',
    description: 'Professional equipment rental and sales in Denton, TX. Excavators, loaders, skid steers, water trucks, and more. Call (817) 403-4334',
    images: ['/assets/Cat%20336.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["EquipmentRental", "LocalBusiness"],
              "name": "Benchmark Equipment Rental & Sales",
              "alternateName": "Benchmark Equipment",
              "description": "Professional construction equipment rental and sales company serving Denton and North Texas. Specializing in excavators, skid steers, loaders, water trucks, and heavy machinery with low-hour, reliable equipment.",
              "image": [
                "https://benchmarkequip.com/assets/Cat%20336.jpeg",
                "https://benchmarkequip.com/assets/cat-skid-steer-action.jpeg",
                "https://benchmarkequip.com/assets/CAT%20Wheel%20loader%20blog.jpg"
              ],
              "logo": "https://benchmarkequip.com/assets/Benchmark%20Logo%20(RGB%20Color%20Reverse).png",
              "url": "https://benchmarkequip.com",
              "telephone": "+1-817-403-4334",
              "email": "info@benchmarkequip.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "3310 Fort Worth Dr",
                "addressLocality": "Denton",
                "addressRegion": "TX",
                "postalCode": "76205",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 33.2148,
                "longitude": -97.1331
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Denton"
                },
                {
                  "@type": "State",
                  "name": "Texas"
                }
              ],
              "serviceType": ["Equipment Rental", "Heavy Machinery Rental", "Construction Equipment Sales"],
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "07:00",
                  "closes": "17:00"
                }
              ],
              "priceRange": "$$",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": "50"
              },
              "founder": {
                "@type": "Person",
                "name": "Tyler McClain"
              },
              "slogan": "Driven by Relationships, Powered by Reliability"
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
