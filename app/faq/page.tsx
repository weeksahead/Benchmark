import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'FAQ - Heavy Equipment Rental Questions Answered | Benchmark Equipment',
  description: 'Find answers to 100+ frequently asked questions about heavy equipment rental in DFW. Learn about pricing, delivery, excavators, skid steers, maintenance, and more from Benchmark Equipment in Denton, TX.',
  alternates: {
    canonical: 'https://benchmarkequip.com/faq',
  },
  openGraph: {
    title: 'FAQ - Heavy Equipment Rental Questions | Benchmark Equipment',
    description: 'Get answers to common questions about equipment rental, pricing, delivery, and service in the Dallas-Fort Worth area.',
    url: 'https://benchmarkequip.com/faq',
    type: 'website',
  },
  keywords: [
    'heavy equipment rental FAQ',
    'equipment rental questions',
    'DFW equipment rental',
    'excavator rental FAQ',
    'skid steer rental questions',
    'Denton equipment rental',
    'construction equipment FAQ',
    'Benchmark Equipment FAQ'
  ],
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <FAQ />
      <Footer />
    </>
  )
}
