import { Metadata } from 'next'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Equipment & Industry Blog - Construction Tips & Guides',
  description: 'Expert insights on heavy equipment rental, safety tips, maintenance guides, and industry knowledge from Benchmark Equipment in Denton, TX. Learn about excavators, skid steers, wheel loaders, and more.',
  alternates: {
    canonical: 'https://benchmarkequip.com/blog',
  },
  openGraph: {
    title: 'Equipment & Industry Blog - Construction Tips & Guides',
    description: 'Expert insights on heavy equipment rental, safety tips, and industry knowledge from Benchmark Equipment.',
    url: 'https://benchmarkequip.com/blog',
  },
}

export default function BlogPage() {
  return <BlogClient />
}
