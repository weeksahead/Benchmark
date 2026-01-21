import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Contact from '@/components/Contact'

export const metadata: Metadata = {
  title: 'Contact Benchmark Equipment - Get a Quote for Equipment Rental',
  description: 'Contact Benchmark Equipment in Denton, TX for equipment rental quotes, sales inquiries, or service questions. Call (940) 295-7100 or visit us at 5900 N Interstate 35, Denton, TX 76207.',
  openGraph: {
    title: 'Contact Benchmark Equipment - Get a Quote for Equipment Rental',
    description: 'Contact us for equipment rental quotes and sales inquiries. Call (940) 295-7100 or visit our Denton, TX location.',
    url: 'https://benchmarkequip.com/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <Contact />
      <Footer />
    </>
  )
}
