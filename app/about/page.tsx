import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import About from '@/components/About'

export const metadata: Metadata = {
  title: 'About Benchmark Equipment - Denton TX Equipment Rental Company',
  description: 'Learn about Benchmark Equipment, a family-owned construction equipment rental and sales company in Denton, TX. We provide excavators, skid steers, and heavy equipment with personalized service and competitive rates.',
  openGraph: {
    title: 'About Benchmark Equipment - Denton TX Equipment Rental Company',
    description: 'Family-owned construction equipment rental and sales company in Denton, TX. Personalized service, competitive rates, and quality equipment.',
    url: 'https://benchmarkequip.com/about',
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <About />
      <Footer />
    </>
  )
}
