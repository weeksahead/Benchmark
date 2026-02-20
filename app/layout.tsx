import type { Metadata } from 'next'
import './globals.css'
import TylerAI from '@/components/TylerAI'
import Script from 'next/script'

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
              "description": "Professional heavy duty equipment rental and sales company serving Denton and North Texas. Specializing in excavators, wheel loaders, dozers, rollers, compactors, skid steers, water trucks, off-road trucks, and more with low-hour, reliable Cat equipment.",
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
                  "name": "Denton",
                  "containedInPlace": { "@type": "State", "name": "Texas" }
                },
                {
                  "@type": "City",
                  "name": "Fort Worth",
                  "containedInPlace": { "@type": "State", "name": "Texas" }
                },
                {
                  "@type": "City",
                  "name": "Dallas",
                  "containedInPlace": { "@type": "State", "name": "Texas" }
                },
                {
                  "@type": "City",
                  "name": "McKinney",
                  "containedInPlace": { "@type": "State", "name": "Texas" }
                },
                {
                  "@type": "City",
                  "name": "Frisco",
                  "containedInPlace": { "@type": "State", "name": "Texas" }
                },
                {
                  "@type": "City",
                  "name": "Arlington",
                  "containedInPlace": { "@type": "State", "name": "Texas" }
                },
                { "@type": "State", "name": "Texas" },
                { "@type": "State", "name": "Oklahoma" },
                { "@type": "State", "name": "Arkansas" },
                { "@type": "State", "name": "Louisiana" }
              ],
              "serviceType": ["Equipment Rental", "Heavy Machinery Rental", "Construction Equipment Sales"],
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
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
        {/* FAQ Schema for AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What types of equipment does Benchmark Equipment rent?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Benchmark Equipment rents heavy duty construction equipment including excavators, wheel loaders, dozers, rollers, compactors, skid steers, water trucks, off-road trucks, and more. We specialize in Cat equipment and maintain low-hour machines for maximum reliability on your job site."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What areas does Benchmark Equipment serve?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Benchmark Equipment is headquartered in North Texas and provides heavy equipment rentals nationwide. We regularly deliver equipment to job sites across the country, including New York, Michigan, California, Arizona, and everywhere in between. No project is too far."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I rent equipment from Benchmark Equipment?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Renting is simple. Call Tyler directly at (817) 403-4334 or email info@benchmarkequip.com to get set up. We'll discuss your project needs, confirm equipment availability, and coordinate logistics. Most rentals can be arranged within 24-48 hours."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Benchmark Equipment offer equipment delivery?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Benchmark Equipment offers full-service delivery nationwide, or you can arrange pickup yourself. We also relocate equipment between job sites as your project needs change. Our logistics team handles everything so you can focus on the work."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Should I rent or buy construction equipment?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Unless you plan to use equipment over 90% of available hours year-round, renting is typically the smarter financial decision. Renting eliminates maintenance costs, storage, depreciation, and capital tied up in assets. Use our free Rent vs Buy Calculator at benchmarkequip.com/rent-vs-buy to run the numbers for your situation."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are Benchmark Equipment's business hours?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our office is open Monday through Friday, 8:00 AM to 5:00 PM. However, you can call anytime. We regularly coordinate equipment deliveries on weekends and after hours when projects demand it. Whatever it takes to meet our customers' needs."
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CE9WXZB9V3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CE9WXZB9V3');
          `}
        </Script>
        {children}
        <TylerAI />
      </body>
    </html>
  )
}
