'use client'

import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, TrendingDown, Clock } from 'lucide-react';

const RentVsBuyCalculator = () => {
  const [equipmentType, setEquipmentType] = useState<string>('Excavator');
  const [purchasePrice, setPurchasePrice] = useState<number>(150000);
  const [hoursPerYear, setHoursPerYear] = useState<number>(800);
  const [yearsOfOwnership, setYearsOfOwnership] = useState<number>(5);
  const [operatorWage, setOperatorWage] = useState<number>(50);
  const [maintenancePerHour, setMaintenancePerHour] = useState<number>(15);
  const [monthlyRentalRate, setMonthlyRentalRate] = useState<number>(4500);
  const [interestRate, setInterestRate] = useState<number>(0.06);
  const [taxRate, setTaxRate] = useState<number>(0.25);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [calculationResults, setCalculationResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const performCalculation = async () => {
    setIsCalculating(true);
    const WORK_HOURS_PER_YEAR = 2080;
    const HOURS_PER_RENTAL_MONTH = 176;

    const utilizationRate = hoursPerYear / WORK_HOURS_PER_YEAR;

    // BUYING COSTS
    const buyOperatorCosts = WORK_HOURS_PER_YEAR * operatorWage * yearsOfOwnership;
    const totalMaintenance = hoursPerYear * yearsOfOwnership * maintenancePerHour;
    const insurancePerYear = purchasePrice * 0.015;
    const totalInsurance = insurancePerYear * yearsOfOwnership;
    const storagePerYear = 0;
    const totalStorage = storagePerYear * yearsOfOwnership;

    // Bonus depreciation
    const depreciationYear1 = purchasePrice * 0.20;
    const depreciationYears2Plus = purchasePrice * 0.12;
    const totalDepreciation = depreciationYear1 + (depreciationYears2Plus * (yearsOfOwnership - 1));
    const resaleValue = purchasePrice - totalDepreciation;

    // Financing costs
    const averageLoanBalance = purchasePrice / 2;
    const financingCost = interestRate > 0 ? averageLoanBalance * interestRate * yearsOfOwnership : 0;

    const totalBuyCost = purchasePrice + buyOperatorCosts + totalMaintenance +
                       totalInsurance + totalStorage + financingCost - resaleValue;
    const buyAnnualCost = totalBuyCost / yearsOfOwnership;
    const buyCostPerHour = totalBuyCost / (hoursPerYear * yearsOfOwnership);

    // RENTING COSTS
    const rentalMonthsPerYear = hoursPerYear / HOURS_PER_RENTAL_MONTH;
    const totalRentalCost = monthlyRentalRate * rentalMonthsPerYear * yearsOfOwnership;
    const rentOperatorCosts = hoursPerYear * operatorWage * yearsOfOwnership;

    const totalRentCost = totalRentalCost + rentOperatorCosts;
    const rentAnnualCost = totalRentCost / yearsOfOwnership;
    const rentCostPerHour = totalRentCost / (hoursPerYear * yearsOfOwnership);

    // TAX CALCULATIONS
    const buyDepreciationTaxSavings = totalDepreciation * taxRate;
    const rentTaxSavings = totalRentalCost * taxRate;

    const buyAfterTaxCost = totalBuyCost - buyDepreciationTaxSavings;
    const rentAfterTaxCost = totalRentCost - rentTaxSavings;

    const savings = totalBuyCost - totalRentCost;
    const savingsPercent = (savings / totalBuyCost) * 100;
    const recommendation = savings > 0 ? 'RENT' : 'BUY';

    const afterTaxSavings = buyAfterTaxCost - rentAfterTaxCost;
    const afterTaxSavingsPercent = (afterTaxSavings / buyAfterTaxCost) * 100;
    const afterTaxRecommendation = afterTaxSavings > 0 ? 'RENT' : 'BUY';

    const results = {
      utilizationRate,
      totalBuyCost,
      buyAnnualCost,
      buyCostPerHour,
      resaleValue,
      totalDepreciation,
      buyOperatorCosts,
      totalMaintenance,
      totalInsurance,
      totalStorage,
      financingCost,
      totalRentCost,
      rentAnnualCost,
      rentCostPerHour,
      totalRentalCost,
      rentOperatorCosts,
      monthlyRentalRate,
      rentalMonthsPerYear,
      buyDepreciationTaxSavings,
      rentTaxSavings,
      buyAfterTaxCost,
      rentAfterTaxCost,
      afterTaxSavings: Math.abs(afterTaxSavings),
      afterTaxSavingsPercent: Math.abs(afterTaxSavingsPercent),
      afterTaxRecommendation,
      savings: Math.abs(savings),
      savingsPercent: Math.abs(savingsPercent),
      recommendation
    };

    setCalculationResults(results);
    setHasCalculated(true);

    // Log to Monday.com
    try {
      await fetch('/api/monday-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentType,
          purchasePrice,
          hoursPerYear,
          yearsOfOwnership,
          operatorWage,
          maintenancePerHour,
          monthlyRentalRate,
          interestRate,
          taxRate,
          recommendation: results.afterTaxRecommendation,
          savings: results.afterTaxSavings,
          totalBuyCost: results.buyAfterTaxCost,
          totalRentCost: results.rentAfterTaxCost,
        }),
      });
    } catch (error) {
      console.error('Failed to log to Monday.com:', error);
      // Don't show error to user, just log it
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const calculations = calculationResults;
  const displayCosts = calculations ? {
    buyCost: calculations.buyAfterTaxCost,
    rentCost: calculations.rentAfterTaxCost,
    savings: calculations.afterTaxSavings,
    savingsPercent: calculations.afterTaxSavingsPercent,
    recommendation: calculations.afterTaxRecommendation
  } : null;

  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Rent/Buy Calculator</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compare the true cost of buying vs. renting heavy equipment over time
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 mb-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-red-500" />
            <h3 className="text-2xl font-bold">Equipment Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Equipment Type <span className="text-gray-400 normal-case">(include brand and model)</span>
              </label>
              <input
                type="text"
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-lg transition-all duration-300"
                placeholder="e.g., CAT 336 Excavator, Bobcat S650"
              />
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Purchase Price: <span className="text-red-400">{formatCurrency(purchasePrice)}</span>
              </label>
              <input
                type="range"
                min="50000"
                max="500000"
                step="5000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Hours Per Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Hours Per Year: <span className="text-red-400">{hoursPerYear} hrs</span> ({formatPercent(hoursPerYear / 2080)} utilization)
              </label>
              <input
                type="range"
                min="200"
                max="2080"
                step="50"
                value={hoursPerYear}
                onChange={(e) => setHoursPerYear(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Years of Ownership */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Years of Ownership: <span className="text-red-400">{yearsOfOwnership} years</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={yearsOfOwnership}
                onChange={(e) => setYearsOfOwnership(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Operator Wage */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Operator Hourly Wage (fully loaded): <span className="text-red-400">${operatorWage}/hr</span>
              </label>
              <input
                type="range"
                min="25"
                max="100"
                step="5"
                value={operatorWage}
                onChange={(e) => setOperatorWage(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Maintenance Per Hour */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Maintenance Cost Per Hour: <span className="text-red-400">${maintenancePerHour}/hr</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={maintenancePerHour}
                onChange={(e) => setMaintenancePerHour(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Monthly Rental Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Monthly Rental Rate: <span className="text-red-400">{formatCurrency(monthlyRentalRate)}/month</span>
              </label>
              <input
                type="range"
                min="1000"
                max="15000"
                step="100"
                value={monthlyRentalRate}
                onChange={(e) => setMonthlyRentalRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Financing Interest Rate: <span className="text-red-400">{(interestRate * 100).toFixed(1)}%</span> {interestRate === 0 ? '(Cash)' : ''}
              </label>
              <input
                type="range"
                min="0"
                max="0.12"
                step="0.005"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Tax Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Tax Rate: <span className="text-red-400">{(taxRate * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0.15"
                max="0.40"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <button
              onClick={performCalculation}
              disabled={isCalculating}
              className={`px-12 py-4 rounded-lg font-bold text-lg transition-all flex items-center gap-3 shadow-lg ${
                isCalculating
                  ? 'bg-red-700 cursor-not-allowed transform scale-95 opacity-75'
                  : 'bg-red-600 hover:bg-red-700 hover:transform hover:scale-105 active:scale-95'
              } text-white`}
            >
              <Calculator className={`w-6 h-6 ${isCalculating ? 'animate-spin' : ''}`} />
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </button>
            <p className="text-sm text-gray-400">Hit calculate as you make changes to see updated finanicals*</p>
          </div>
        </div>

        {/* Results Section - Only show after calculation */}
        {!hasCalculated ? (
          <div className="bg-gray-900 rounded-xl shadow-lg p-12 mb-8 text-center border border-gray-700">
            <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Click "Calculate" to see your results</p>
          </div>
        ) : (
          <>
            {/* Recommendation Banner */}
            <div className={`rounded-xl shadow-lg p-8 mb-8 text-center ${
              displayCosts.recommendation === 'RENT'
                ? 'bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-500'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-500'
            }`}>
              <h3 className="text-3xl font-bold text-white mb-2">
                {displayCosts.recommendation === 'RENT' ? '✓ Renting Saves You Money' : 'Buying Makes Sense'}
              </h3>
              <p className="text-xl text-white">
                Save {formatCurrency(displayCosts.savings)} ({displayCosts.savingsPercent.toFixed(1)}%) after tax over {yearsOfOwnership} years by {displayCosts.recommendation === 'RENT' ? 'renting' : 'buying'}
              </p>
            </div>

            {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Buy Card */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-8 h-8 text-blue-500" />
              <h3 className="text-2xl font-bold">Buying</h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Purchase Price</span>
                <span className="font-semibold text-white">{formatCurrency(purchasePrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Operator Costs (Full-Time)</span>
                <span className="font-semibold text-white">{formatCurrency(calculations.buyOperatorCosts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Maintenance</span>
                <span className="font-semibold text-white">{formatCurrency(calculations.totalMaintenance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Insurance</span>
                <span className="font-semibold text-white">{formatCurrency(calculations.totalInsurance)}</span>
              </div>
              {calculations.financingCost > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Financing Interest</span>
                  <span className="font-semibold text-red-400">{formatCurrency(calculations.financingCost)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-green-400">
                <span>Resale Value</span>
                <span className="font-semibold">-{formatCurrency(calculations.resaleValue)}</span>
              </div>
              <div className="flex justify-between items-center text-green-400">
                <span>Tax Savings (Depreciation)</span>
                <span className="font-semibold">-{formatCurrency(calculations.buyDepreciationTaxSavings)}</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Cost (After Tax)</span>
                <span className="text-blue-400">{formatCurrency(displayCosts.buyCost)}</span>
              </div>
            </div>

            {calculations.utilizationRate < 0.5 && (
              <div className="mt-4 bg-orange-900/30 border border-orange-700 rounded-lg p-4">
                <p className="text-sm text-orange-300">
                  ⚠️ Low utilization: Machine only used {hoursPerYear} hours/year ({formatPercent(calculations.utilizationRate)})
                </p>
              </div>
            )}
          </div>

          {/* Rent Card */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-green-500" />
              <h3 className="text-2xl font-bold">Renting</h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Purchase Price</span>
                <span className="font-semibold text-gray-500">$0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Operator Costs (Usage Only)</span>
                <span className="font-semibold text-white">{formatCurrency(calculations.rentOperatorCosts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Maintenance</span>
                <span className="font-semibold text-gray-500">$0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Insurance</span>
                <span className="font-semibold text-gray-500">$0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Rental Costs ({calculations.rentalMonthsPerYear.toFixed(1)} months/year)</span>
                <span className="font-semibold text-white">{formatCurrency(calculations.totalRentalCost)}</span>
              </div>
              {calculations.financingCost > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Financing Interest</span>
                  <span className="font-semibold text-gray-500">$0</span>
                </div>
              )}
              <div className="flex justify-between items-center text-gray-500">
                <span>Resale Value</span>
                <span className="font-semibold">$0</span>
              </div>
              <div className="flex justify-between items-center text-green-400">
                <span>Tax Savings (100% Deductible)</span>
                <span className="font-semibold">-{formatCurrency(calculations.rentTaxSavings)}</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Cost (After Tax)</span>
                <span className="text-green-400">{formatCurrency(displayCosts.rentCost)}</span>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Benefits of Renting Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold text-green-300">Benefits of Renting</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <span className="text-green-200 font-medium">No maintenance costs</span>
                  <p className="text-green-300/70 text-sm">All repairs and maintenance included</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <span className="text-green-200 font-medium">No insurance required</span>
                  <p className="text-green-300/70 text-sm">Coverage included in rental rate</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <span className="text-green-200 font-medium">No depreciation risk</span>
                  <p className="text-green-300/70 text-sm">Return equipment when done</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <span className="text-green-200 font-medium">No storage costs</span>
                  <p className="text-green-300/70 text-sm">We pick it up when finished</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <span className="text-green-200 font-medium">Flexibility to scale</span>
                  <p className="text-green-300/70 text-sm">Rent only what you need, when you need it</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <span className="text-green-200 font-medium">Latest equipment models</span>
                  <p className="text-green-300/70 text-sm">Access to newest technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>Estimates based on industry averages. Actual costs may vary.</p>
        </div>
      </div>
    </section>
  );
};

export default RentVsBuyCalculator;
