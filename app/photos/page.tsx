import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Photos from '@/components/Photos'

export const metadata: Metadata = {
  title: 'Equipment Photos - Benchmark Equipment Rental Fleet Gallery',
  description: 'Browse photos of our construction equipment rental fleet including excavators, skid steers, track loaders, and attachments. See the quality equipment available for rent in Denton, TX.',
  openGraph: {
    title: 'Equipment Photos - Benchmark Equipment Rental Fleet Gallery',
    description: 'Browse our construction equipment rental fleet. Excavators, skid steers, track loaders, and attachments available in Denton, TX.',
    url: 'https://benchmarkequip.com/photos',
  },
}

export default function PhotosPage() {
  return (
    <>
      <Header />
      <Photos />
      <Footer />
    </>
  )
}
