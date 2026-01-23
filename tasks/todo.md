# Answer Engine Optimization (AEO) Audit & Implementation

## Audit Summary
Site has strong foundational SEO but needs AEO enhancements to rank well in AI answer engines (ChatGPT, Perplexity, Google AI Overview, etc.)

### Current Strengths
- Comprehensive root layout metadata with Open Graph & Twitter cards
- LocalBusiness + EquipmentRental JSON-LD schema
- BlogPosting schema on individual blog posts
- AI-friendly robots.txt (allows GPTBot, ClaudeBot, PerplexityBot)
- Quality blog content (24+ posts, 1000+ words each)

### Key Gaps Identified
- Secondary pages (About, Contact, Rent-vs-Buy, Photos) lack custom metadata
- No FAQ schema markup
- No breadcrumb navigation schema
- Static sitemap missing pages, not auto-generated
- No related posts / internal linking strategy
- No HowTo or Service schema for equipment guides

---

## Phase 1: Quick Wins (High Impact, Low Effort) - COMPLETED

### Page-Specific Metadata
- [x] Add custom metadata to `/about/page.tsx`
- [x] Add custom metadata to `/contact/page.tsx`
- [x] Add custom metadata to `/rent-vs-buy/page.tsx`
- [x] Add custom metadata to `/photos/page.tsx`

### FAQ Schema
- [x] Create FAQ data for common equipment rental questions
- [x] Add FAQPage JSON-LD schema to homepage (in layout.tsx)

### Sitemap Updates
- [x] Add `/rent-vs-buy` to sitemap.xml
- [x] Update lastmod dates in sitemap

---

## Phase 2: Structural Improvements

### Breadcrumb Navigation
- [ ] Create BreadcrumbList JSON-LD schema component
- [ ] Add breadcrumbs to blog post pages
- [ ] Add breadcrumbs to secondary pages

### Internal Linking
- [ ] Add "Related Posts" section to blog post template
- [ ] Cross-link relevant equipment guides within blog content

### Dynamic Sitemap
- [ ] Create dynamic sitemap.ts that pulls from Supabase
- [ ] Remove static sitemap.xml in favor of dynamic generation

---

## Phase 3: Content Enhancement

### Service Schema
- [ ] Add Service schema for equipment rental service
- [ ] Add Service schema for equipment sales service
- [ ] Add Service schema for delivery service

### Author Schema
- [ ] Create Person schema for Tyler McClain (expertise signals)
- [ ] Link author schema to blog posts

### Review/Testimonial Schema
- [ ] Verify aggregate rating (5.0 / 50 reviews) accuracy
- [ ] Add individual Review schema if testimonials exist

---

## Phase 4: Advanced AEO

### HowTo Schema (for guides)
- [ ] Add HowTo schema to "How to Choose" style blog posts
- [ ] Add step-by-step markup where applicable

### Product Schema
- [ ] Consider Product schema for equipment categories
- [ ] Add offers/pricing structure if applicable

### Video Schema (if applicable)
- [ ] Add VideoObject schema to any video content

---

## Review - Phase 1 Complete (2025-01-20)

### Changes Made

**1. Page Metadata (4 pages updated)**
- Converted all 4 pages from client to server components to enable metadata export
- Added unique title, description, and Open Graph tags to each:
  - `/about` - Company info and family-owned messaging
  - `/contact` - Phone number, address, and quote CTA
  - `/rent-vs-buy` - Calculator tool description
  - `/photos` - Fleet gallery description

**2. FAQ Schema (6 questions)**
Added FAQPage JSON-LD schema to `app/layout.tsx` with these questions:
- What types of equipment does Benchmark rent?
- What areas does Benchmark serve?
- How do I rent equipment?
- Does Benchmark offer delivery?
- Should I rent or buy?
- What are the business hours?

**3. Sitemap Updates**
- Added `/rent-vs-buy` page entry
- Updated homepage lastmod to 2025-01-20

**4. Component Fixes**
Added 'use client' directive to components that were missing it:
- `components/Contact.tsx`
- `components/Photos.tsx`
- `components/Footer.tsx`

### Build Status
Build passes successfully with all pages generating correctly

---

# Previous Completed Tasks

## Remove Vercel Analytics - COMPLETED
**Successfully removed Vercel Analytics. Site now uses only Google Analytics for comprehensive tracking.**

## Add Google Analytics (GA4) - COMPLETED
**Successfully implemented Google Analytics 4 tracking across the entire site.**

---

# SEO Audit Fix - 2025-01-23

## Issues Identified from External Audit

### Critical Issues
1. **Sitemap XML Parsing Error** - Line 20 has an unescaped `&` character in "Driven by Relationships, Powered by Reliability". XML requires `&amp;` instead of `&`.

2. **Missing Canonical URLs** - About and Contact pages have OpenGraph URLs but lack explicit `alternates.canonical` tags.

3. **Broken Footer Links** - 6 links in Footer.tsx Equipment section use `href="#"` placeholder links (lines 59-64).

### Medium Priority Issues
4. **Homepage Multiple H1 Tags** - Hero.tsx has an H1 inside a `.map()` loop, creating 5 H1 tags (one per carousel slide). Should have only one H1 per page.

5. **Blog Listing Missing Metadata** - `/app/blog/page.tsx` is a client component with no metadata export.

---

## Todo List

- [x] Fix sitemap.xml - Escape the `&` as `&amp;` on line 20
- [x] Add canonical URLs to About and Contact page metadata
- [x] Fix footer broken links - Replace `href="#"` with actual equipment catalog URLs
- [x] Fix multiple H1 tags in Hero.tsx - Only render one H1
- [x] Add blog listing metadata - Create server component wrapper

---

## Review - Completed 2025-01-23

### Changes Made

**1. Sitemap XML Fix** (`public/sitemap.xml`)
- Escaped `&` to `&amp;` in the image caption on line 20
- XML now validates successfully with xmllint

**2. Canonical URLs** (`app/about/page.tsx`, `app/contact/page.tsx`)
- Added `alternates.canonical` to both page metadata exports
- About: `https://benchmarkequip.com/about`
- Contact: `https://benchmarkequip.com/contact`

**3. Footer Links** (`components/Footer.tsx`)
- Replaced 6 broken `href="#"` links with actual equipment catalog URL
- All equipment category links now point to `https://rent.benchmarkequip.com/items`
- Added `target="_blank"` and `rel="noopener noreferrer"` for external links

**4. Multiple H1 Fix** (`components/Hero.tsx`)
- Modified carousel to render H1 only for the active slide
- Non-active slides use `<span>` with `aria-hidden="true"` for accessibility
- Visual appearance unchanged, semantic HTML now correct (single H1 per page)

**5. Blog Listing Metadata** (`app/blog/page.tsx`, `app/blog/BlogClient.tsx`)
- Split client/server components to enable metadata export
- Created new `BlogClient.tsx` with all interactive functionality
- `page.tsx` is now a server component with proper metadata:
  - Title: "Equipment & Industry Blog - Construction Tips & Guides"
  - Canonical URL: `https://benchmarkequip.com/blog`
  - OpenGraph tags

### Build Status
- Build passes successfully
- XML sitemap validates
- All 44 pages generate correctly
