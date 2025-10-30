# Rent/buy Calculator Implementation Plan

## Overview
Add a "Rent/buy calculator" section to the homepage to help users determine whether it's more cost-effective to rent or purchase equipment over a given time period.

## Todo List

- [ ] Create `/components/RentVsBuyCalculator.tsx` component
- [ ] Add calculator to homepage between Services and Footer sections
- [ ] Test calculations and styling
- [ ] Run build to verify no errors

---

## Component Design

### Input Fields
1. Equipment name (text)
2. Equipment purchase price (currency with $ formatting)
3. Monthly rental cost (currency with $ formatting)
4. Time horizon in months (number)
5. Monthly maintenance cost for owned equipment (currency)
6. Expected resale value percentage (e.g., 60%)

### Calculations
- **Total Rent Cost** = Monthly Rental × Time Horizon
- **Total Own Cost** = Purchase Price + (Monthly Maintenance × Time Horizon) - Resale Value
- **Resale Value** = Purchase Price × (Resale % / 100)
- **Savings** = |Total Rent Cost - Total Own Cost|
- **Break-even Point** = Month when ownership becomes cheaper than renting

### Results Display
- Total rent cost vs total ownership cost comparison
- Break-even month analysis
- Recommendation (rent or buy) with conditional styling
- Detailed cost breakdown
- Fun messaging similar to PurchaseCalculator

---

## Technical Implementation

### Component Structure
Following the existing PurchaseCalculator pattern:
- Use `'use client'` directive
- Dark theme: `bg-gray-900`, `bg-gray-800`
- Red accents: `bg-red-600`, `text-red-400`
- Currency formatting with `$` and commas
- Real-time calculation with `useEffect`
- Results with conditional styling (green for buy, red/orange for rent)

### Styling Guidelines
- Container: `max-w-7xl mx-auto px-4`
- Section wrapper: `bg-black text-white py-20`
- Title styling to match Services section
- Form inputs with same styling as PurchaseCalculator
- Responsive grid for inputs

### Files to Modify
1. Create: `/components/RentVsBuyCalculator.tsx`
2. Update: `/app/page.tsx` (add component import and render)

---

## Review Section

### Summary
Successfully implemented a fully-functional Rent/Buy Calculator component on the homepage with dark theme styling and comprehensive cost comparison logic.

### Changes Made

#### 1. Created `/components/RentVsBuyCalculator.tsx` ✅
- Component follows existing dark theme styling (bg-black, bg-gray-900, bg-gray-800)
- Uses red accent colors (bg-red-600, text-red-400) to match brand
- Implements all 10 input fields with slider controls:
  - Equipment Type (text input)
  - Purchase Price ($50k-$500k)
  - Hours Per Year (200-2,080 hrs with utilization %)
  - Years of Ownership (1-10 years)
  - Operator Hourly Wage ($25-$100/hr fully loaded)
  - Maintenance Cost Per Hour ($5-$30/hr)
  - Monthly Rental Rate ($1k-$15k/month)
  - Financing Interest Rate (0-12%)
  - Tax Rate (15-40%)
  - Before/After Tax toggle

#### 2. Calculation Logic ✅
**BUYING COSTS:**
- Purchase price
- Operator costs: 2,080 hours/year (full-time) × wage × years
- Maintenance: hours/year × years × maintenance rate
- Insurance: purchase price × 1.5% per year
- Financing interest: average loan balance × rate × years
- Resale value: 20% depreciation year 1, then 12% annually
- Tax benefit: depreciation × tax rate (bonus depreciation)

**RENTING COSTS:**
- Rental cost: monthly rate × (hours per year ÷ 176 hours/month) × years
- Operator costs: actual hours used × wage × years (usage only)
- Tax benefit: rental costs are 100% tax deductible × tax rate

#### 3. Display Features ✅
- **Section title:** "Rent/Buy Calculator" with centered heading
- **Two-column responsive layout:** Buy side vs Rent side
- **Complete cost breakdowns** with line items for all expenses
- **Prominent recommendation banner** showing which option saves money (green for rent, blue for buy)
- **Utilization rate displayed** prominently (hours ÷ 2,080)
- **Rental months calculated:** hours ÷ 176 hours/month
- **Before/After tax toggle** with smooth transition
- **Currency formatting** with $ and commas using toLocaleString

#### 4. Additional Features ✅
- **Low utilization warning:** Shows orange warning when machine is used < 50%
- **Rent side benefits box:** Lists 6 key benefits in green styling
- **Real-time calculations:** Uses useMemo for automatic recalculation
- **Responsive design:** Two-column on desktop, stacks on mobile
- **Icon integration:** Uses Lucide React icons (Calculator, DollarSign, Clock)
- **Smooth interactions:** Hover effects and transitions throughout

#### 5. Homepage Integration ✅
- Updated `/app/page.tsx` to import and render RentVsBuyCalculator
- Component placed between Services section and Footer
- Maintains consistent page flow and spacing

### Files Modified
1. **Created:** `/components/RentVsBuyCalculator.tsx` (new file)
2. **Updated:** `/app/page.tsx` (added import and component)

### Technical Implementation
- **Framework:** Next.js 16.0.0 with 'use client' directive
- **State Management:** React useState hooks (10 state variables)
- **Performance:** useMemo for efficient calculation caching
- **TypeScript:** Full type safety with proper interfaces
- **Styling:** Tailwind CSS utility classes only (no custom CSS)
- **Icons:** Lucide React for Calculator, DollarSign, TrendingDown, Clock

### Build Results
✅ **Build successful** - No TypeScript errors
✅ **All pages compiled** successfully
✅ **Static optimization** working correctly

### Testing Checklist
**Before Deploying:**
- ☐ Test locally with `npm run dev`
- ☐ Verify all sliders adjust calculations in real-time
- ☐ Test Before/After Tax toggle
- ☐ Verify recommendation banner changes based on calculations
- ☐ Check responsive design on mobile viewport
- ☐ Test with various equipment scenarios (high/low utilization)

**After Deploying:**
- ☐ Test on production URL
- ☐ Verify calculator loads quickly
- ☐ Test on different browsers (Chrome, Safari, Firefox)
- ☐ Verify mobile responsiveness on actual devices

### User Experience Highlights
1. **Immediate feedback:** All calculations update in real-time as sliders move
2. **Clear recommendations:** Large banner tells users which option saves money
3. **Transparency:** Complete cost breakdowns show exactly where money goes
4. **Flexibility:** Before/After tax toggle lets users see both scenarios
5. **Visual hierarchy:** Color-coded results (green for savings, blue for buy)
6. **Educational:** Shows utilization rate and rental benefits to inform decisions

### Next Steps
1. Deploy to production
2. Monitor user engagement with the calculator
3. Consider adding:
   - Print/PDF export functionality
   - Email results feature
   - Comparison chart/graph visualization
   - Save calculation to user account (if auth added)

---

## Update: Add Insurance Costs for Renters

### Problem
Currently, the calculator only includes insurance costs for buying, not for renting. This is unrealistic because renters also need insurance when they have equipment.

### Proposed Solution
**Insurance Logic:**
- **Buying**: Insurance 365 days/year (year-round coverage) - Current implementation ✅
- **Renting**: Insurance pro-rated to rental months used (only when equipment is rented) - **NEW**

This makes sense because:
- Owners need insurance whether equipment is working or idle
- Renters only need insurance during the actual rental period (correlated to utilization)

### Implementation Plan

#### 1. Review Current Insurance Calculation (Buying)
- Current: `insurancePerYear = purchasePrice * 0.015`
- Current: `totalInsurance = insurancePerYear * yearsOfOwnership`
- This covers 12 months/year - ✅ Correct for buying

#### 2. Add Insurance Calculation for Renting
- New variable: `rentInsurancePerYear`
- Formula: `(purchasePrice * 0.015) * (rentalMonthsPerYear / 12)`
- Example: If renting 4.5 months/year → pay 37.5% of annual insurance
- New variable: `totalRentInsurance = rentInsurancePerYear * yearsOfOwnership`

#### 3. Update Total Rent Cost
- Add `totalRentInsurance` to the total rent cost calculation
- Update: `totalRentCost = totalRentalCost + rentOperatorCosts + totalRentInsurance`
- Update all dependent calculations (after-tax, per hour, etc.)

#### 4. Update UI Display (Rent Card)
- Change Insurance line from `$0` (gray) to calculated amount (white)
- Display: `formatCurrency(calculations.totalRentInsurance)`
- Make line item color consistent with active costs (white instead of gray)

#### 5. Test Calculations
- Verify insurance scales correctly with rental months
- Test edge cases: very low utilization vs high utilization
- Ensure recommendation logic still works correctly

### Files to Modify
1. `/components/RentVsBuyCalculator.tsx` - Update calculations and UI

### Expected Impact
- Renting will become slightly more expensive (more realistic)
- Low utilization scenarios: minimal impact (small rental months)
- High utilization scenarios: larger insurance costs for renters

### Implementation Summary ✅

**Changes Made:**

1. **Added rental insurance calculation** (RentVsBuyCalculator.tsx:56-58)
   - `rentInsurancePerYear = insurancePerYear * (rentalMonthsPerYear / 12)`
   - `totalRentInsurance = rentInsurancePerYear * yearsOfOwnership`
   - Pro-rated based on actual rental months used

2. **Updated total rent cost** (RentVsBuyCalculator.tsx:60)
   - Changed from: `totalRentalCost + rentOperatorCosts`
   - Changed to: `totalRentalCost + rentOperatorCosts + totalRentInsurance`

3. **Added to results object** (RentVsBuyCalculator.tsx:96)
   - Added `totalRentInsurance` to calculation results

4. **Updated Rent Card UI** (RentVsBuyCalculator.tsx:448-450)
   - Changed label: "Insurance" → "Insurance (Pro-rated)"
   - Changed value: `$0` (gray) → `{formatCurrency(calculations.totalRentInsurance)}` (white)
   - Now shows actual calculated insurance cost

**Example Calculation (Default Values):**
- Purchase Price: $150,000
- Hours Per Year: 800
- Rental Months: 4.5 months/year
- Insurance Rate: 1.5% of purchase price

*Buying:* $2,250/year × 5 years = **$11,250** total
*Renting:* $2,250 × (4.5/12) × 5 years = **$4,219** total

**Build Status:** ✅ Successful (no errors)

---

## Update: Moved Calculator to Separate Page

### Changes Made (Latest)

#### 1. Removed Calculator from Homepage ✅
- Removed `RentVsBuyCalculator` import and component from `/app/page.tsx`
- Homepage now shows: Header → Hero → Equipment Categories → Services → Footer

#### 2. Created Dedicated Page ✅
- Created `/app/rent-vs-buy/page.tsx`
- Full-page layout with Header → Calculator → Footer
- Accessible at: `/rent-vs-buy`

#### 3. Added Navigation Links ✅
- Added "Rent/Buy Calculator" to desktop navigation (after Equipment Rentals)
- Added "Rent/Buy Calculator" to mobile navigation
- Link works on both desktop and mobile

#### 4. Improved Rent Side Comparison ✅
- Added matching line items to rent side showing $0 for:
  - Purchase Price: $0
  - Maintenance: $0
  - Insurance: $0
  - Financing Interest: $0 (if applicable)
  - Resale Value: $0
- Shows actual costs for:
  - Operator Costs (Usage Only): [calculated value]
  - Rental Costs: [calculated value]
  - Tax Savings: [calculated value if after-tax]

#### 5. Moved Benefits Section ✅
- Moved "Benefits of Renting" section below both comparison cards
- Now appears as a standalone section with:
  - 2-column grid layout (responsive)
  - Green icon checkmarks
  - Benefit title + description for each item
  - Enhanced visual presentation

### Files Modified (Latest Update)
1. **Updated:** `/app/page.tsx` - Removed calculator
2. **Created:** `/app/rent-vs-buy/page.tsx` - New dedicated page
3. **Updated:** `/components/Header.tsx` - Added navigation links
4. **Updated:** `/components/RentVsBuyCalculator.tsx` - Improved rent side and moved benefits
