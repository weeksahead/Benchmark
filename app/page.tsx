import { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://benchmarkequip.com/',
  },
}

export default function Home() {
  return <HomeClient />
}
