import React from 'react';

const PrivacyPolicy = () => {
  return (
    <section className="bg-black text-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              request equipment rental quotes, make a reservation, or contact us for support. This may include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name, email address, and phone number</li>
              <li>Business or company information</li>
              <li>Billing and payment information</li>
              <li>Equipment rental preferences and history</li>
              <li>Communications with our customer service team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process equipment rental transactions and provide customer service</li>
              <li>Send you rental confirmations, invoices, and important updates</li>
              <li>Improve our services and develop new offerings</li>
              <li>Comply with legal obligations and protect our business interests</li>
              <li>Communicate with you about promotions and services (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>With service providers who assist us in operating our business</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In connection with a business transfer or merger</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of the information we have about you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
            <p>
              Our website may use cookies and similar tracking technologies to enhance your browsing 
              experience, analyze website traffic, and understand user preferences. You can control 
              cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices or content of these external sites. We encourage you to review the 
              privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any material 
              changes by posting the new policy on our website and updating the "Last updated" date 
              at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="mb-2"><strong>Benchmark Equipment Rental & Sales</strong></p>
              <p className="mb-2">3310 Fort Worth Dr, Denton, TX 76205</p>
              <p className="mb-2">Phone: (817) 403-4334</p>
              <p>Email: tyler@benchmarkequip.com</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;