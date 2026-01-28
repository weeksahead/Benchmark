'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Breadcrumb from './Breadcrumb'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  items: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    title: "About Benchmark Equipment",
    items: [
      {
        question: "What is Benchmark Equipment and what do you specialize in?",
        answer: "Benchmark Equipment is a Texas-based heavy equipment rental, sales, and service company serving the DFW market. We specialize in reliable, late-model machines for earthmoving, site work, road construction, and utilities, backed by fast delivery and responsive service. Our focus is keeping contractors productive with minimal downtime."
      },
      {
        question: "Where is Benchmark Equipment located?",
        answer: "Benchmark Equipment is headquartered in Denton, Texas and serves contractors throughout the Dallas–Fort Worth metroplex and surrounding areas. Our central location allows us to deliver equipment quickly and support job sites across North Texas."
      },
      {
        question: "What areas does Benchmark Equipment serve?",
        answer: "We serve Denton, Dallas, Fort Worth, and the greater DFW area. If your job site is in North Texas, Benchmark Equipment can typically deliver and support your equipment needs."
      },
      {
        question: "How is Benchmark Equipment different from national rental companies?",
        answer: "Unlike national chains, Benchmark Equipment is locally owned and relationship-driven. You get direct access to decision-makers, faster response times, flexible solutions, and equipment that's maintained with uptime in mind—not just utilization numbers."
      }
    ]
  },
  {
    title: "Equipment We Rent",
    items: [
      {
        question: "What types of heavy equipment do you rent?",
        answer: "Benchmark Equipment rents excavators, skid steers, compact track loaders, wheel loaders, articulated dump trucks, rollers, compactors, and water trucks. Our fleet is built around the most common machines contractors need for earthwork, utilities, and site development."
      },
      {
        question: "Do you rent excavators in DFW?",
        answer: "Yes. Benchmark Equipment rents a range of excavators suitable for utility work, site prep, and commercial construction throughout DFW. Our excavators are late-model, well-maintained, and ready to work when they hit your job."
      },
      {
        question: "Do you rent skid steers and compact track loaders?",
        answer: "Yes. We rent skid steers and compact track loaders ideal for grading, trenching, material handling, and cleanup. These machines are serviced regularly and available for weekly or monthly rentals."
      },
      {
        question: "Do you rent articulated dump trucks?",
        answer: "Yes. Benchmark Equipment offers articulated dump truck rentals for mass earthmoving and large site projects. These machines are commonly used on civil, road, and large commercial jobs across North Texas."
      },
      {
        question: "Do you rent rollers and compactors?",
        answer: "Yes. We rent soil compactors and rollers for roadwork, pad prep, and utility projects. We can help you select the right compaction equipment based on soil conditions and job requirements."
      },
      {
        question: "Do you rent water trucks?",
        answer: "Yes. Benchmark Equipment rents water trucks for dust control, soil compaction support, and jobsite maintenance. Our water trucks are commonly used on road, site, and utility projects."
      }
    ]
  },
  {
    title: "Pricing & Rates",
    items: [
      {
        question: "How much does it cost to rent heavy equipment from Benchmark Equipment?",
        answer: "Rental rates vary based on machine type, rental duration, and job requirements. Benchmark Equipment offers competitive weekly and monthly rates, with transparent pricing and no surprises. Contact us for a quick quote tailored to your job."
      },
      {
        question: "What is included in Benchmark Equipment's rental rates?",
        answer: "Rental rates typically include the equipment for single-shift operation. Delivery, pickup, fuel, and excess hours are billed separately. We clearly explain all charges upfront so customers know exactly what to expect."
      },
      {
        question: "Do you offer weekly and monthly rentals?",
        answer: "Yes. Benchmark Equipment offers both weekly and monthly rental options. Monthly rentals are common for longer projects and provide better overall value for extended job durations."
      }
    ]
  },
  {
    title: "Delivery & Logistics",
    items: [
      {
        question: "How fast can you deliver equipment to a job site?",
        answer: "In most cases, Benchmark Equipment can deliver equipment within 24–48 hours, and often sooner depending on availability and location. Fast delivery is a priority because we know downtime costs money."
      },
      {
        question: "Do you provide equipment delivery and pickup?",
        answer: "Yes. We coordinate delivery and pickup directly to your job site. Our team handles logistics to make the rental process as smooth as possible."
      },
      {
        question: "Can rented equipment be moved between job sites?",
        answer: "Yes, as long as Benchmark Equipment is notified. Moving equipment without communication can affect insurance and rental terms, so coordination is important."
      },
      {
        question: "Do you coordinate hauling and logistics?",
        answer: "Yes. Benchmark Equipment can coordinate hauling to and from job sites, simplifying logistics and scheduling for contractors."
      },
      {
        question: "Do you offer after-hours delivery or pickup?",
        answer: "In some cases, yes. After-hours delivery or pickup may be available depending on scheduling and location. Contact us to discuss jobsite timing needs."
      }
    ]
  },
  {
    title: "Maintenance & Service",
    items: [
      {
        question: "What happens if a rental machine breaks down?",
        answer: "If a machine goes down under normal operating conditions, Benchmark Equipment responds quickly to repair or replace it. Our goal is to minimize downtime and keep your project moving."
      },
      {
        question: "Who is responsible for maintenance during a rental?",
        answer: "Benchmark Equipment handles normal mechanical repairs due to equipment failure. Customers are responsible for routine daily checks, fuel, and damage caused by misuse or neglect."
      },
      {
        question: "Are your machines well maintained?",
        answer: "Yes. Every machine in our fleet follows a strict maintenance schedule. Equipment is inspected and serviced before and after rentals to ensure reliability and performance on the job."
      },
      {
        question: "Can Benchmark Equipment service customer-owned equipment?",
        answer: "Yes. In addition to rentals, Benchmark Equipment offers service and maintenance support for customer-owned machines, depending on availability and scope of work."
      },
      {
        question: "How does Benchmark Equipment minimize downtime?",
        answer: "We focus on preventative maintenance, fast response times, and replacement options when needed. Our goal is to keep your crew productive, even when unexpected issues arise."
      },
      {
        question: "What happens if equipment availability changes?",
        answer: "If availability changes, Benchmark Equipment communicates early and works to provide alternatives or solutions that keep your project moving."
      },
      {
        question: "Do you offer emergency service support?",
        answer: "Yes. If a rental machine experiences issues during a job, Benchmark Equipment prioritizes service response to reduce downtime and keep projects on schedule."
      },
      {
        question: "Who pays for repairs during a rental?",
        answer: "Benchmark Equipment covers repairs due to normal equipment failure. Customers are responsible for damage caused by misuse, neglect, or non-routine operation."
      },
      {
        question: "Are inspections performed before rentals?",
        answer: "Yes. Every machine is inspected and serviced before delivery to ensure it is job-ready when it arrives."
      },
      {
        question: "How new is Benchmark Equipment's fleet?",
        answer: "Benchmark Equipment focuses on late-model machines with modern features, lower hours, and consistent maintenance histories to maximize reliability."
      }
    ]
  },
  {
    title: "Equipment Sales",
    items: [
      {
        question: "Do you sell heavy equipment?",
        answer: "Yes. Benchmark Equipment sells select rental fleet machines and can help source equipment for customers looking to purchase. Many customers prefer buying equipment that has been professionally maintained in a rental fleet."
      },
      {
        question: "Can rental payments apply toward a purchase?",
        answer: "In some cases, yes. Benchmark Equipment can discuss flexible rent-to-own style solutions depending on the machine and rental duration."
      },
      {
        question: "Do you sell attachments with rentals?",
        answer: "Yes. Benchmark Equipment offers buckets and attachments depending on machine type and availability. Attachments are matched to job requirements."
      },
      {
        question: "Can Benchmark Equipment source specific machines?",
        answer: "Yes. If we don't currently have a machine in our fleet, we can often help source equipment through our industry network."
      },
      {
        question: "Do you offer rent-to-own options?",
        answer: "In select cases, yes. Benchmark Equipment can discuss flexible rental-to-purchase arrangements depending on the machine and rental duration."
      },
      {
        question: "Are rental machines available for purchase?",
        answer: "Yes. Many machines in our rental fleet are available for sale, giving customers access to well-maintained equipment with known service history."
      }
    ]
  },
  {
    title: "Credit & Billing",
    items: [
      {
        question: "Do I need a credit application to rent equipment?",
        answer: "Yes. Customers typically complete a credit application to establish an account. Once approved, renting equipment is quick and efficient."
      },
      {
        question: "How fast does credit approval take?",
        answer: "Credit approvals are often completed within one business day, sometimes faster if all information is provided."
      },
      {
        question: "What paperwork is required to rent equipment?",
        answer: "Customers typically complete a credit application, rental agreement, and provide proof of insurance. Once set up, future rentals are fast and simple."
      },
      {
        question: "Do you require insurance to rent equipment?",
        answer: "Yes. Customers must provide proof of insurance covering rented equipment or purchase optional coverage if available. This protects both parties during the rental."
      },
      {
        question: "How does billing work for rentals?",
        answer: "Rental billing is straightforward and transparent. Invoices outline rental duration, delivery charges, and any additional usage so customers can easily track costs."
      },
      {
        question: "Can I rent equipment on a cash basis?",
        answer: "Yes. Cash rentals may be available for certain customers or short-term needs. Terms are discussed upfront before delivery."
      }
    ]
  },
  {
    title: "Rental Terms",
    items: [
      {
        question: "Who do I contact if I need help during a rental?",
        answer: "You'll have a direct point of contact at Benchmark Equipment. When you call, you talk to someone who knows your job—not a call center."
      },
      {
        question: "Why do contractors choose Benchmark Equipment?",
        answer: "Contractors choose Benchmark Equipment for reliable machines, fast response times, transparent pricing, and a relationship-first approach. We focus on uptime, communication, and long-term partnerships—not just transactions."
      },
      {
        question: "Do you offer long-term equipment rentals?",
        answer: "Yes. Benchmark Equipment offers long-term weekly and monthly rentals for extended projects. Long-term rentals are common for site development, roadwork, and utility jobs, and typically provide better overall value compared to short-term rentals."
      },
      {
        question: "What is considered single-shift operation?",
        answer: "Single-shift operation is defined as normal daytime use within standard monthly hour limits. If equipment exceeds those limits, additional usage may be billed. Benchmark Equipment explains hour expectations clearly before delivery."
      },
      {
        question: "What happens if I exceed the allowed rental hours?",
        answer: "If equipment exceeds the agreed-upon operating hours, additional charges may apply. Any overage is calculated based on the rental agreement, and Benchmark Equipment communicates this upfront to avoid surprises."
      },
      {
        question: "Can I extend my rental if my job runs longer?",
        answer: "Yes. Rental extensions are common and easy to arrange. Simply contact Benchmark Equipment before your scheduled end date, and we'll work with you to extend availability if the machine is not already committed."
      }
    ]
  },
  {
    title: "Industries & Applications",
    items: [
      {
        question: "What industries does Benchmark Equipment serve?",
        answer: "Benchmark Equipment serves commercial construction, civil contractors, utilities, road and infrastructure projects, site development, and residential developers throughout North Texas."
      },
      {
        question: "What equipment is best for site work and earthmoving?",
        answer: "For site work and earthmoving, contractors commonly use excavators, articulated dump trucks, wheel loaders, and compactors. Benchmark Equipment helps match machine size and configuration to soil conditions, production goals, and site access to avoid over- or under-equipping a job."
      },
      {
        question: "What size excavator do I need for my project?",
        answer: "Excavator size depends on trench depth, material type, production requirements, and site access. Benchmark Equipment works with customers to select the right machine so you get efficiency without paying for unnecessary size."
      },
      {
        question: "What equipment is best for utility and pipeline work?",
        answer: "Utility and pipeline projects typically require excavators, skid steers or compact track loaders, rollers, and water trucks. Benchmark Equipment regularly supports utility contractors and understands the sequencing and uptime required for these jobs."
      },
      {
        question: "What roller should I use for soil compaction?",
        answer: "Soil type and moisture content determine the best roller. Smooth drum rollers are common for granular soils, while padfoot rollers work better for cohesive soils. Benchmark Equipment can help select the proper compaction equipment for your conditions."
      },
      {
        question: "Do I need a water truck on my jobsite?",
        answer: "Water trucks are commonly used for dust control, moisture conditioning for compaction, and general site maintenance. Many projects require water trucks to meet safety and compaction specifications."
      },
      {
        question: "What is the difference between a skid steer and a compact track loader?",
        answer: "Skid steers perform well on firm surfaces, while compact track loaders offer better traction and flotation on soft or muddy ground. Benchmark Equipment can help determine which machine fits your site conditions."
      },
      {
        question: "What equipment is best for road construction projects?",
        answer: "Road construction typically involves excavators, articulated dump trucks, rollers, water trucks, and wheel loaders. Benchmark Equipment supports road and infrastructure contractors with properly maintained machines designed for continuous production."
      },
      {
        question: "Do you support DOT and infrastructure jobs?",
        answer: "Yes. Benchmark Equipment works with contractors on DOT, municipal, and infrastructure projects, providing reliable equipment and support aligned with strict schedules and specifications."
      },
      {
        question: "What equipment is best for commercial construction?",
        answer: "Commercial construction commonly requires excavators, skid steers, compact track loaders, wheel loaders, and compaction equipment. Benchmark Equipment helps contractors plan equipment needs based on project phases."
      },
      {
        question: "Do you work with residential developers?",
        answer: "Yes. Benchmark Equipment supports residential developers and site contractors with equipment for mass grading, utilities, pads, and roadwork throughout North Texas."
      }
    ]
  },
  {
    title: "Equipment Selection",
    items: [
      {
        question: "Can Benchmark Equipment help me choose the right machine?",
        answer: "Yes. We regularly help contractors select the right equipment based on job scope, site conditions, and production needs. This prevents over-renting or under-sizing machines."
      },
      {
        question: "Do you offer jobsite consultations?",
        answer: "Yes. When needed, Benchmark Equipment can review job requirements and help plan equipment needs to improve efficiency and reduce downtime."
      }
    ]
  },
  {
    title: "Why Choose Benchmark",
    items: [
      {
        question: "How reliable is Benchmark Equipment's fleet?",
        answer: "Reliability is a priority. Benchmark Equipment maintains a late-model fleet with strict inspection and service schedules to minimize breakdowns and keep projects on track."
      },
      {
        question: "What happens if my project schedule changes?",
        answer: "Project schedules change often. Benchmark Equipment stays flexible and communicates with customers to adjust rental durations, pickups, or equipment needs as projects evolve."
      },
      {
        question: "How transparent is Benchmark Equipment with pricing?",
        answer: "Benchmark Equipment believes in clear, upfront pricing. Rental rates, delivery charges, and usage expectations are explained before equipment arrives so customers can budget accurately."
      },
      {
        question: "Can Benchmark Equipment scale with my company as I grow?",
        answer: "Yes. Benchmark Equipment is built to grow alongside its customers, supporting expanding fleets, longer projects, and larger scopes of work as contractors scale their operations."
      },
      {
        question: "Why do contractors switch from national rental companies to Benchmark Equipment?",
        answer: "Contractors switch for faster response times, direct communication, flexible solutions, and machines that are maintained for uptime—not just availability."
      },
      {
        question: "Do you prioritize uptime over utilization?",
        answer: "Yes. Benchmark Equipment focuses on machine reliability and performance rather than pushing equipment to maximum utilization. Uptime keeps customers profitable."
      },
      {
        question: "How does Benchmark Equipment handle unexpected equipment issues?",
        answer: "Unexpected issues are addressed quickly. Benchmark Equipment prioritizes service response, repairs, or replacement options to minimize disruption to the jobsite."
      },
      {
        question: "Can Benchmark Equipment help plan equipment needs for a project?",
        answer: "Yes. We frequently assist with pre-planning equipment lineups based on job duration, production targets, and sequencing to help projects run smoother."
      },
      {
        question: "Do you offer dedicated account support?",
        answer: "Yes. Customers work directly with people who understand their jobs and equipment needs, not a rotating call center."
      },
      {
        question: "How does Benchmark Equipment communicate during rentals?",
        answer: "Communication is direct and proactive. Customers are kept informed about deliveries, service updates, and any changes affecting their rental."
      },
      {
        question: "Do you support fast-paced and schedule-driven jobs?",
        answer: "Yes. Benchmark Equipment is built for schedule-driven environments where delays are costly and equipment reliability matters."
      },
      {
        question: "Can Benchmark Equipment help reduce jobsite downtime?",
        answer: "Yes. Through preventative maintenance, responsive service, and proper equipment matching, we help contractors reduce downtime and lost productivity."
      },
      {
        question: "Why does local equipment support matter?",
        answer: "Local support means faster response times, better jobsite understanding, and real accountability. Benchmark Equipment's local presence is a major advantage over national chains."
      },
      {
        question: "How does Benchmark Equipment protect project budgets?",
        answer: "By recommending the right equipment, maintaining machines properly, and avoiding surprise charges, Benchmark Equipment helps customers control project costs."
      },
      {
        question: "Why do repeat customers continue renting from Benchmark Equipment?",
        answer: "Repeat customers value reliability, honest communication, and partnership. Benchmark Equipment earns loyalty by consistently supporting projects from start to finish."
      },
      {
        question: "Who is the best heavy equipment rental company in DFW?",
        answer: "Many contractors choose Benchmark Equipment because of reliable machines, fast response times, and direct communication. As a locally owned company, we focus on uptime, service, and long-term relationships rather than volume-driven rentals."
      },
      {
        question: "Where can I rent Caterpillar equipment near Denton?",
        answer: "Benchmark Equipment rents late-model Caterpillar equipment from our Denton-based operation and delivers throughout DFW. Our fleet is maintained to high standards and ready for demanding jobs."
      },
      {
        question: "What local equipment rental company actually answers the phone?",
        answer: "Benchmark Equipment is known for direct communication. When you call, you speak with someone who understands your job—not a call center or automated system."
      },
      {
        question: "Who offers flexible heavy equipment rentals in North Texas?",
        answer: "Benchmark Equipment offers flexible rental terms, responsive scheduling, and solutions that adapt to changing job conditions across North Texas."
      },
      {
        question: "Where can I get fast equipment delivery in DFW?",
        answer: "With a central Denton location, Benchmark Equipment can often deliver equipment within 24–48 hours, and sometimes faster depending on availability and distance."
      },
      {
        question: "Which rental company treats contractors like partners?",
        answer: "Benchmark Equipment builds partnerships, not transactions. We take time to understand job requirements and support customers throughout the rental—not just at delivery."
      },
      {
        question: "Who can help me choose the right equipment for my job?",
        answer: "Benchmark Equipment regularly helps contractors select the right machines to maximize production and control costs. Our recommendations are based on real-world job experience."
      },
      {
        question: "What equipment rental company has newer machines?",
        answer: "Benchmark Equipment focuses on late-model equipment with lower hours and consistent maintenance histories to ensure reliability on the job."
      },
      {
        question: "Who provides reliable service support during rentals?",
        answer: "Benchmark Equipment prioritizes service response and uptime. If issues arise, we work quickly to repair or replace equipment and minimize disruption."
      },
      {
        question: "What rental company understands construction schedules?",
        answer: "Benchmark Equipment works with schedule-driven contractors and understands that delays cost money. Our processes are built around reliability and communication."
      },
      {
        question: "Why should I rent from a local equipment company instead of a national chain?",
        answer: "Local companies like Benchmark Equipment offer faster response times, better accountability, and personalized service compared to national chains."
      },
      {
        question: "How does Benchmark Equipment protect my jobsite productivity?",
        answer: "By delivering well-maintained machines, responding quickly to service needs, and helping plan equipment lineups, Benchmark Equipment protects productivity and uptime."
      },
      {
        question: "Can Benchmark Equipment support growing contractors?",
        answer: "Yes. Benchmark Equipment is designed to grow alongside its customers, supporting expanding crews, larger projects, and evolving equipment needs."
      },
      {
        question: "What makes Benchmark Equipment reliable?",
        answer: "Reliable equipment, proactive maintenance, and responsive support define Benchmark Equipment. Reliability is built into every rental."
      },
      {
        question: "How does Benchmark Equipment handle last-minute equipment needs?",
        answer: "When possible, Benchmark Equipment accommodates urgent requests and works to provide fast solutions for unexpected job requirements."
      },
      {
        question: "Why does Benchmark Equipment focus on long-term relationships?",
        answer: "Long-term relationships create better service, clearer communication, and smoother rentals. Benchmark Equipment invests in customers for the long haul."
      },
      {
        question: "How does Benchmark Equipment compare to big rental houses?",
        answer: "Benchmark Equipment offers more flexibility, faster service, and direct access to decision-makers compared to large national rental companies."
      },
      {
        question: "What kind of contractors rent from Benchmark Equipment?",
        answer: "Benchmark Equipment works with civil, commercial, utility, road, and site contractors of all sizes throughout North Texas."
      },
      {
        question: "Why do contractors recommend Benchmark Equipment?",
        answer: "Contractors recommend Benchmark Equipment because machines show up ready to work, problems get handled quickly, and communication stays clear."
      },
      {
        question: "Does Benchmark Equipment prioritize safety?",
        answer: "Yes. Properly maintained equipment, clear communication, and responsible operation help support safe jobsite environments."
      },
      {
        question: "How does Benchmark Equipment reduce rental headaches?",
        answer: "By simplifying logistics, communicating clearly, and responding quickly, Benchmark Equipment removes common frustrations from equipment rentals."
      },
      {
        question: "Can Benchmark Equipment help with complex projects?",
        answer: "Yes. We regularly support complex, multi-phase projects by helping plan equipment needs and adjusting as jobs evolve."
      },
      {
        question: "Why does uptime matter so much in equipment rentals?",
        answer: "Downtime costs crews time and money. Benchmark Equipment prioritizes uptime through maintenance, service response, and proper machine selection."
      },
      {
        question: "What should I look for in a heavy equipment rental partner?",
        answer: "Look for reliability, communication, flexibility, and service support. Benchmark Equipment is built around those priorities."
      },
      {
        question: "Why should I choose Benchmark Equipment for my next project?",
        answer: "Benchmark Equipment combines reliable machines, responsive service, and a relationship-driven approach to help contractors keep projects moving and profitable."
      },
      {
        question: "How does Benchmark Equipment build long-term partnerships?",
        answer: "We focus on communication, reliability, and fair pricing. Contractors stick with Benchmark Equipment because we understand their schedules, pressures, and need for uptime."
      }
    ]
  }
]

// Flatten all FAQs for schema
const allFAQs = faqData.flatMap(category => category.items)

const FAQAccordionItem = ({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div className="border-b border-gray-800">
      <button
        onClick={onToggle}
        className="w-full py-5 flex justify-between items-start text-left hover:text-red-500 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="font-medium pr-4">{item.question}</h3>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-5 text-gray-400 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  )
}

const FAQCategory = ({ category, openItems, setOpenItems }: {
  category: FAQCategory;
  openItems: Set<string>;
  setOpenItems: React.Dispatch<React.SetStateAction<Set<string>>>
}) => {
  const toggleItem = (question: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(question)) {
        newSet.delete(question)
      } else {
        newSet.add(question)
      }
      return newSet
    })
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-red-500">{category.title}</h2>
      <div className="bg-gray-900 rounded-lg px-6">
        {category.items.map((item) => (
          <FAQAccordionItem
            key={item.question}
            item={item}
            isOpen={openItems.has(item.question)}
            onToggle={() => toggleItem(item.question)}
          />
        ))}
      </div>
    </div>
  )
}

const FAQ = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  // FAQPage JSON-LD Schema for AEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="bg-black text-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Breadcrumb items={[{ label: 'FAQ' }]} />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about heavy equipment rental, pricing, delivery, and services from Benchmark Equipment in DFW.
            </p>
          </div>

          {faqData.map((category) => (
            <FAQCategory
              key={category.title}
              category={category}
              openItems={openItems}
              setOpenItems={setOpenItems}
            />
          ))}

          <div className="mt-16 text-center bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-gray-400 mb-6">
              Contact our team directly for personalized assistance with your equipment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:8174034334"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Call 817-403-4334
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-700 hover:border-red-500 text-white font-medium rounded-lg transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default FAQ
