import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RentVsBuyCalculator from '@/components/RentVsBuyCalculator'

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator - Should You Rent or Buy Construction Equipment?',
  description: 'Use our free rent vs buy calculator to determine if renting or buying construction equipment is more cost-effective for your project. Compare costs for excavators, skid steers, and more.',
  openGraph: {
    title: 'Rent vs Buy Calculator - Should You Rent or Buy Construction Equipment?',
    description: 'Free calculator to compare renting vs buying construction equipment. Make informed decisions for your project budget.',
    url: 'https://benchmarkequip.com/rent-vs-buy',
  },
  alternates: {
    canonical: 'https://benchmarkequip.com/rent-vs-buy',
  },
}

export default function RentVsBuyPage() {
  return (
    <>
      <Header />
      <RentVsBuyCalculator />
      <Footer />
    </>
  )
}
