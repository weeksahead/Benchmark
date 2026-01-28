import React from 'react';
import Breadcrumb from './Breadcrumb';

const About = () => {
  return (
    <section className="bg-black text-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'About' }]} />
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-12">About Benchmark Equipment</h1>
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-lg leading-relaxed">
          <p>
            Welcome to Benchmark Equipment! Founded by Tyler McClain, Benchmark Equipment is the culmination 
            of over a decade of hands-on experience in the heavy equipment rental industry. Starting from a passion 
            for helping customers find the right machinery and logistics solutions, Tyler launched Benchmark to 
            provide top-notch service, long-term customer relationships, and a fleet of reliable, high-quality 
            equipment.
          </p>

          <p>
            At Benchmark Equipment, our goal is simple: to offer the best machinery and support so your projects 
            run smoothly. Whether you're renting excavators, skid steers, rollers, or water trucks, we ensure every 
            piece of equipment is maintained and ready to perform.
          </p>

          <p>
            We pride ourselves on hands-on service and a commitment to helping you succeed.
          </p>
        </div>

        {/* Why Choose Benchmark Section */}
        <div className="mt-16">
          <div className="bg-gray-900 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-8">Why Choose Benchmark?</h2>
            
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                Over 10 years of industry experience
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                Comprehensive fleet of well-maintained equipment
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                Personalized customer service and support
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                Flexible rental terms and competitive pricing
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                Local expertise with regional knowledge
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;