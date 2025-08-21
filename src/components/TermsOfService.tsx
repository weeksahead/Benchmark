import React from 'react';

const TermsOfService = () => {
  return (
    <section className="bg-black text-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
            <p>
              By accessing and using the services of Benchmark Equipment Rental & Sales ("Company," "we," "us," or "our"), 
              you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not 
              agree with any of these terms, you are prohibited from using our services.
            </p>
            <p className="mt-4">
              <strong>Important Note:</strong> These general terms are subject to the specific terms and conditions 
              outlined in individual rental agreements. In the event of any conflict between these general terms and 
              a specific rental agreement, the terms of the individual rental agreement shall supersede and take 
              precedence over the information contained on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Equipment Rental Terms</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Rental Period</h3>
              <p>
                Equipment rental periods begin at the time of delivery or pickup and end at the agreed return time. 
                Late returns may result in additional charges at our standard daily rates.
              </p>
              
              <h3 className="text-xl font-semibold text-white">Equipment Condition</h3>
              <p>
                You are responsible for inspecting equipment upon delivery and reporting any damage or defects 
                immediately. You agree to return equipment in the same condition as received, normal wear and tear excepted.
              </p>
              
              <h3 className="text-xl font-semibold text-white">Authorized Use</h3>
              <p>
                Equipment must be used only for its intended purpose and by qualified operators. Misuse, abuse, or 
                unauthorized modifications are strictly prohibited and may result in additional charges.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Payment Terms</h2>
            <p className="mb-4">
              Payment terms are established at the time of rental agreement. Standard terms include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Payment due upon delivery or as agreed in writing</li>
              <li>Late payment fees may apply to overdue accounts</li>
              <li>Security deposits may be required for certain equipment</li>
              <li>Additional charges for damage, excessive cleaning, or late returns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Liability and Insurance</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Customer Responsibility</h3>
              <p>
                You assume full responsibility for the equipment from delivery until return. You are liable for 
                any loss, damage, or theft of equipment during the rental period.
              </p>
              
              <h3 className="text-xl font-semibold text-white">Insurance Requirements</h3>
              <p>
                Customers may be required to provide proof of insurance coverage for rented equipment. 
                We recommend consulting with your insurance provider regarding coverage for rental equipment.
              </p>
              
              <h3 className="text-xl font-semibold text-white">Limitation of Liability</h3>
              <p>
                Our liability is limited to the repair or replacement of defective equipment. We are not liable 
                for consequential damages, lost profits, or delays in your project.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Safety and Compliance</h2>
            <p className="mb-4">
              You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Operate equipment safely and in accordance with manufacturer guidelines</li>
              <li>Ensure all operators are properly trained and qualified</li>
              <li>Comply with all applicable safety regulations and standards</li>
              <li>Provide and use appropriate personal protective equipment</li>
              <li>Report any accidents or incidents immediately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Delivery and Pickup</h2>
            <p className="mb-4">
              Delivery and pickup services are subject to the following terms:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Delivery times are estimates and may vary due to weather or traffic conditions</li>
              <li>Customer must provide safe and accessible delivery location</li>
              <li>Additional charges may apply for difficult access or special delivery requirements</li>
              <li>Customer is responsible for ensuring adequate space and ground conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cancellation Policy</h2>
            <p>
              Rental reservations may be cancelled with appropriate notice. Cancellation fees may apply 
              depending on the timing and circumstances of the cancellation. Please contact us as soon 
              as possible if you need to modify or cancel your rental.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
            <p>
              These terms are governed by the laws of the State of Texas. Any disputes arising from these 
              terms or your use of our services will be resolved in the courts of Denton County, Texas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting on our website. Your continued use of our services constitutes acceptance of any 
              modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="mb-2"><strong>Benchmark Equipment Rental & Sales</strong></p>
              <p className="mb-2">3310 Fort Worth Dr, Denton, TX 76205</p>
              <p className="mb-2">Phone: <a href="tel:8174034334" className="hover:text-red-500 transition-colors">(817) 403-4334</a></p>
              <p>Email: <a href="mailto:tyler@benchmarkequip.com" className="hover:text-red-500 transition-colors">tyler@benchmarkequip.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;