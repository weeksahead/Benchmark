# GEO Enhancement To-Do List

**Goal: Raise GEO score from ~55-60 to 80+**
**Primary blocker: Zero external visibility/indexing — on-site is solid**

---

## Phase 1: Quick Code Fixes — DONE

- [x] Fix footer typo: "You're trusted partner" → "Your trusted partner"
- [x] Fix footer copyright year: 2024 → 2026
- [x] Fix footer Quick Links: buttons using onClick (not crawlable) → proper `<a href>` links — **This was the biggest on-site SEO issue. Googlebot couldn't follow navigation to blog, about, photos, contact, privacy, or terms pages.**
- [x] Add canonical URLs to pages missing them (photos, rent-vs-buy)
- [x] Enhance LocalBusiness schema `areaServed` — expanded from "United States" to list Denton, Dallas, Fort Worth, McKinney, Frisco, Arlington + TX/OK/AR/LA
- [x] Create `public/llms.txt` — plain-text business summary for AI crawlers
- [x] Add `LLMs-Txt` directive to robots.txt

## Phase 2: New Pages (Need your input on content, I build the pages)

- [ ] **Equipment pages** on main domain (`/equipment`, `/equipment/excavators`, etc.) — Need: list of equipment categories and what to include per category
- [ ] **Service area pages** (`/areas/denton-tx`, `/areas/fort-worth-tx`, etc.) — Need: which cities you actively serve and any local project context
- [ ] **Testimonials page** (`/testimonials`) — Need: actual client testimonials with names/companies
- [ ] **Projects/portfolio page** (`/projects`) — Need: project descriptions, photos, clients served
- [ ] **About page expansion** — Need: Tyler's story, fleet details, certifications, team info

## Phase 3: External/Business Actions (You need to do these — THIS IS WHERE THE SCORE JUMPS)

- [ ] Set up Google Search Console and verify benchmarkequip.com
- [ ] Submit sitemap via Search Console
- [ ] Request indexing for all blog posts via URL Inspection tool
- [ ] Set up Bing Webmaster Tools
- [ ] Google Business Profile — fully optimize with photos, hours, services
- [ ] Yelp Business listing
- [ ] BBB listing
- [ ] Denton Chamber of Commerce membership
- [ ] Facebook Business page (active, with equipment photos)
- [ ] LinkedIn Company page
- [ ] Instagram (jobsite photos)
- [ ] Equipment Trader / Machinery Trader listings
- [ ] American Rental Association (ARA) directory
- [ ] Ensure NAP consistency: "3310 Fort Worth Dr, Denton, TX 76205" everywhere
- [ ] Push clients to leave Google Business Profile reviews

## What's Already Done (from audit items)

- [x] robots.txt — properly configured, not blocking /blog/
- [x] Sitemap — dynamic sitemap.ts includes all blog posts
- [x] SSR — Next.js server components, blog routes are SSR/SSG
- [x] LocalBusiness schema — in layout.tsx (now with detailed areaServed)
- [x] FAQPage schema — in layout.tsx, FAQ component, and blog posts
- [x] BlogPosting schema — in BlogPostClient.tsx with author, publisher, keywords
- [x] BreadcrumbList schema — in Breadcrumb component
- [x] Meta descriptions — on all pages
- [x] Open Graph tags — on all pages
- [x] Canonical URLs — on all pages
- [x] AI crawlers allowed — robots.txt allows GPTBot, ClaudeBot, PerplexityBot, etc.
- [x] Standalone FAQ page with 60+ questions and FAQPage schema

---

## Review

### Changes Made (Phase 1)

1. **Footer links fixed** — Converted 7 `<button onClick>` elements to proper `<a href>` links (Sales→/contact, Photos→/photos, Blog→/blog, About→/about, Contact→/contact, Privacy Policy→/privacy, Terms→/terms). This was preventing Googlebot from discovering pages through internal navigation.

2. **Footer typo fixed** — "You're" → "Your"

3. **Copyright year updated** — 2024 → 2026

4. **Canonical URLs added** — /photos and /rent-vs-buy pages now have canonical tags

5. **LocalBusiness areaServed expanded** — From generic "United States" to specific cities (Denton, Dallas, Fort Worth, McKinney, Frisco, Arlington) and states (TX, OK, AR, LA)

6. **llms.txt created** — Comprehensive plain-text business summary at /llms.txt for AI crawlers, covering services, equipment types, location, service area, and key differentiators

7. **robots.txt updated** — Added LLMs-Txt directive pointing to /llms.txt

### Build Status
All changes compile and build successfully. No errors.

### Files Modified
- `components/Footer.tsx` — Links, typo, copyright year
- `app/layout.tsx` — areaServed schema enhancement
- `app/photos/page.tsx` — Added canonical URL
- `app/rent-vs-buy/page.tsx` — Added canonical URL
- `public/robots.txt` — Added LLMs-Txt directive
- `public/llms.txt` — New file
