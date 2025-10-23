import React from 'react';
import { Trash2, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface SavedCalculation {
  id: string;
  equipmentName: string;
  price: number;
  rental: number;
  utilization: number;
  monthlyROI: number;
  effectiveMonthlyRevenue: number;
  meetsTarget: boolean;
  timestamp: string;
}

interface SavedCalculationsProps {
  calculations: SavedCalculation[];
  onDeleteCalculation: (id: string) => void;
}

const SavedCalculations = ({ calculations, onDeleteCalculation }: SavedCalculationsProps) => {
  const formatCurrency = (amount: number) => {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (calculations.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">📊 Saved Calculations</h2>
          <div className="text-center text-gray-400 py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No saved calculations yet</p>
            <p className="text-sm mt-2">Use the Purchase Calculator to create and save equipment analyses</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-900 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">📊 Saved Calculations</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-700">
              <tr>
                <th className="px-4 py-3">Equipment Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Monthly Rental</th>
                <th className="px-4 py-3">Utilization</th>
                <th className="px-4 py-3">ROI</th>
                <th className="px-4 py-3">Monthly Revenue</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date Saved</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {calculations.map((calc) => (
                <tr key={calc.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="px-4 py-4 font-medium text-white">
                    {calc.equipmentName}
                  </td>
                  <td className="px-4 py-4 text-gray-300">
                    {formatCurrency(calc.price)}
                  </td>
                  <td className="px-4 py-4 text-gray-300">
                    {formatCurrency(calc.rental)}
                  </td>
                  <td className="px-4 py-4 text-gray-300">
                    {calc.utilization}%
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-semibold ${calc.meetsTarget ? 'text-green-400' : 'text-red-400'}`}>
                      {calc.monthlyROI.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-300">
                    {formatCurrency(calc.effectiveMonthlyRevenue)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      calc.meetsTarget 
                        ? 'bg-green-900/30 text-green-300 border border-green-700' 
                        : 'bg-red-900/30 text-red-300 border border-red-700'
                    }`}>
                      {calc.meetsTarget ? (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Terry Approves
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-3 h-3 mr-1" />
                          Terry is heating up
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-xs">
                    {formatDate(calc.timestamp)}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onDeleteCalculation(calc.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Delete calculation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Total calculations: {calculations.length} | 
          Approved: {calculations.filter(c => c.meetsTarget).length} | 
          Needs improvement: {calculations.filter(c => !c.meetsTarget).length}
        </div>
      </div>
    </div>
  );
};

export default SavedCalculations;