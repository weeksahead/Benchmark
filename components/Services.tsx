import React from 'react';
import { Truck, Headphones, Wrench } from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Delivery & Pickup',
    description: 'We deliver equipment directly to your job site and pick it up when you\'re done.'
  },
  {
    icon: Headphones,
    title: 'Expert Consultation',
    description: 'Our equipment specialists help you choose the right tools for your specific project.'
  },
  {
    icon: Wrench,
    title: 'Maintenance & Repair',
    description: 'Full-service maintenance and repair for equipment you own or purchase from us.'
  }
];

const Services = () => {
  return (
    <section className="bg-black text-white py-10 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            More than just equipment rental - we provide comprehensive solutions to keep your projects running smoothly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="bg-gray-900 p-8 rounded-xl hover:bg-gray-800 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="bg-red-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-red-500 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 text-red-100">
              Contact us today for a free consultation and equipment quote
            </p>
            <div className="flex justify-center">
              <a href="tel:8174034334" className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                Call (817) 403-4334
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;