import React from 'react';
import { Settings, Users, CheckCircle } from 'lucide-react';

const ProfessionalSolutions = () => {
  return (
    <section className="bg-black text-white py-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-8">Professional Equipment Rental Solutions</h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            With over a decade of experience in the heavy equipment rental industry, Benchmark 
            Equipment provides reliable machinery and exceptional service for all your construction 
            and project needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
            <div className="flex justify-center mb-6">
              <Settings className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-6">Quality Equipment</h3>
            <p className="text-gray-400 leading-relaxed">
              Maintained and ready-to-perform machinery including excavators, skid steers, rollers, and 
              water trucks.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
            <div className="flex justify-center mb-6">
              <Users className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-6">Expert Service</h3>
            <p className="text-gray-400 leading-relaxed">
              Hands-on support and logistics solutions backed by years of industry expertise and 
              customer relationships.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-6">Project Success</h3>
            <p className="text-gray-400 leading-relaxed">
              We ensure your projects run smoothly with reliable equipment and the support you need 
              to get the job done right.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalSolutions;