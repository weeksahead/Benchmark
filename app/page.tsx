'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import EquipmentCategories from '@/components/EquipmentCategories'
import Services from '@/components/Services'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <EquipmentCategories />
      <Services />
      <Footer />
    </>
  )
}
