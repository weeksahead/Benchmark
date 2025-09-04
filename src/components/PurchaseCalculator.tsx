import React, { useState, useEffect } from 'react';

const PurchaseCalculator = () => {
  const [price, setPrice] = useState<string>('');
  const [priceDisplay, setPriceDisplay] = useState<string>('');
  const [rental, setRental] = useState<string>('');
  const [rentalDisplay, setRentalDisplay] = useState<string>('');
  const [utilization, setUtilization] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const TARGET_ROI = 4.5;
  const TARGET_UTILIZATION = 90;

  // Format number with commas and dollar sign
  const formatWithCommas = (value: string): string => {
    const num = value.replace(/[,$]/g, '');
    if (!num || isNaN(Number(num))) return '';
    return '$' + Number(num).toLocaleString();
  };

  // Handle price input with comma formatting
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[,$]/g, '');
    if (rawValue === '' || !isNaN(Number(rawValue))) {
      setPrice(rawValue);
      setPriceDisplay(rawValue ? formatWithCommas(rawValue) : '');
    }
  };

  // Handle rental input with comma formatting
  const handleRentalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[,$]/g, '');
    if (rawValue === '' || !isNaN(Number(rawValue))) {
      setRental(rawValue);
      setRentalDisplay(rawValue ? formatWithCommas(rawValue) : '');
    }
  };

  useEffect(() => {
    calculateROI();
  }, [price, rental, utilization]);

  const calculateROI = () => {
    const priceNum = parseFloat(price) || 0;
    const rentalNum = parseFloat(rental) || 0;
    const utilizationNum = parseFloat(utilization) || 0;

    if (priceNum <= 0 || rentalNum <= 0 || utilizationNum <= 0) {
      setResults(null);
      return;
    }

    // Calculate effective monthly revenue
    const effectiveMonthlyRevenue = rentalNum * (utilizationNum / 100);
    
    // Calculate monthly ROI as percentage of purchase price
    const monthlyROI = (effectiveMonthlyRevenue / priceNum) * 100;
    
    // Determine if ROI meets target
    const meetsTarget = monthlyROI >= TARGET_ROI;
    
    // Calculate required rental rate to meet target
    const requiredMonthlyRevenue = (TARGET_ROI / 100) * priceNum;
    const requiredRentalRate = requiredMonthlyRevenue / (utilizationNum / 100);
    
    // Calculate difference
    const roiDifference = monthlyROI - TARGET_ROI;
    const rentalDifference = requiredRentalRate - rentalNum;

    setResults({
      monthlyROI,
      effectiveMonthlyRevenue,
      meetsTarget,
      roiDifference,
      rentalDifference,
      requiredRentalRate
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
          🏗️ Equipment ROI Calculator
        </h2>
        
        {/* Target Dashboard */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Target ROI</div>
            <div className="text-2xl font-bold text-red-400">{TARGET_ROI}%</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Target Utilization</div>
            <div className="text-2xl font-bold text-red-400">{TARGET_UTILIZATION}%</div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Equipment Price Input */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-wider">
              Equipment Price
            </label>
            <div className="relative">
              <input
                type="text"
                id="price"
                value={priceDisplay}
                onChange={handlePriceChange}
                placeholder="Enter purchase price"
                className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-lg transition-all duration-300"
              />
            </div>
          </div>

          {/* Monthly Rental Rate Input */}
          <div>
            <label htmlFor="rental" className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-wider">
              Monthly Rental Rate
            </label>
            <div className="relative">
              <input
                type="text"
                id="rental"
                value={rentalDisplay}
                onChange={handleRentalChange}
                placeholder="Enter monthly rental"
                className="w-full px-4 py-3 pr-16 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-lg transition-all duration-300"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                /mo
              </span>
            </div>
          </div>

          {/* Utilization Rate Input */}
          <div>
            <label htmlFor="utilization" className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-wider">
              Utilization Rate (90% is the target)
            </label>
            <div className="relative">
              <input
                type="number"
                id="utilization"
                value={utilization}
                onChange={(e) => setUtilization(e.target.value)}
                placeholder="Enter utilization"
                min="0"
                max="100"
                step="1"
                className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-lg transition-all duration-300"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {!results ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400 min-h-[200px] flex items-center justify-center">
              <div>Enter all values to calculate ROI</div>
            </div>
          ) : (
            <div className={`rounded-lg p-8 transition-all duration-300 ${
              results.meetsTarget 
                ? 'bg-gradient-to-br from-green-900/50 to-green-800/50 border-2 border-green-600' 
                : 'bg-gradient-to-br from-red-900/50 to-red-800/50 border-2 border-red-600'
            }`}>
              {/* ROI Display */}
              <div className="text-center mb-6">
                <div className="text-sm text-gray-300 uppercase tracking-wider mb-2">
                  Monthly ROI
                </div>
                <div className={`text-5xl font-bold leading-none ${
                  results.meetsTarget ? 'text-green-400' : 'text-red-400'
                }`}>
                  {results.monthlyROI.toFixed(2)}%
                </div>
              </div>
              
              {/* Calculation Details */}
              <div className="bg-gray-800/80 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Effective Monthly Revenue:</span>
                    <span className="text-white font-bold">${results.effectiveMonthlyRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Minimum ROI:</span>
                    <span className="text-white font-bold">{TARGET_ROI}%</span>
                  </div>
                </div>
              </div>

              {/* Feedback Message */}
              <div className={`rounded-lg p-4 font-medium ${
                results.meetsTarget 
                  ? 'bg-green-900/30 text-green-300 border border-green-700' 
                  : 'bg-red-900/30 text-red-300 border border-red-700'
              }`}>
                {results.meetsTarget ? (
                  <div>
                    <span className="text-xl mr-2">✅</span>
                    <strong>Excellent!</strong> You're exceeding the target by{' '}
                    <strong>{results.roiDifference.toFixed(2)}%</strong>.
                    At current utilization, you're earning{' '}
                    <strong>${Math.abs(results.rentalDifference).toFixed(2)}/mo</strong>{' '}
                    more than the minimum required.
                    <div className="mt-2 text-green-200 font-bold">🔥 Terry Approves! 🔥</div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xl mr-2">⚠️</span>
                    <strong>Below Target!</strong> You need to increase your monthly rental rate to{' '}
                    <strong>${results.requiredRentalRate.toFixed(2)}</strong>{' '}
                    (an increase of <strong>${Math.abs(results.rentalDifference).toFixed(2)}/mo</strong>) to achieve{' '}
                    <strong>{TARGET_ROI}% ROI</strong> at <strong>{utilization}% utilization</strong>.
                    <div className="mt-2 text-red-200 font-bold">🌡️ Terry is heating up! 🌡️</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseCalculator;