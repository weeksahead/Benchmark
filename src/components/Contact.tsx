import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { MONDAY_CONFIG } from '../config/monday';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    business: '',
    request: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // First, create the item with just the name
      const createItemQuery = {
        query: `
          mutation {
            create_item (
              board_id: ${MONDAY_CONFIG.BOARD_ID},
              item_name: "${formData.fullName} - ${formData.business || 'Contact Form'}"
            ) {
              id
            }
          }
        `
      };

      const createResponse = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': MONDAY_CONFIG.API_TOKEN
        },
        body: JSON.stringify(createItemQuery)
      });

      const createResult = await createResponse.json();
      
      if (createResult.errors) {
        throw new Error('Failed to create item');
      }

      const itemId = createResult.data.create_item.id;

      // Then update the columns
      const columnValues = JSON.stringify({
        [MONDAY_CONFIG.COLUMNS.PHONE]: formData.phone,
        [MONDAY_CONFIG.COLUMNS.EMAIL]: formData.email,
        [MONDAY_CONFIG.COLUMNS.COMPANY]: formData.business,
        [MONDAY_CONFIG.COLUMNS.REQUEST]: formData.request
      });

      const updateQuery = {
        query: `
          mutation {
            change_multiple_column_values (
              board_id: ${MONDAY_CONFIG.BOARD_ID},
              item_id: ${itemId},
              column_values: "${columnValues.replace(/"/g, '\\"')}"
            ) {
              id
            }
          }
        `
      };

      const updateResponse = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': MONDAY_CONFIG.API_TOKEN
        },
        body: JSON.stringify(updateQuery)
      });

      const updateResult = await updateResponse.json();

      if (updateResult.errors) {
        throw new Error('Failed to update item details');
      }

      setSubmitStatus('success');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        business: '',
        request: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-black text-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-12">Get In Touch</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-red-500" />
                <span className="text-xl">(817) 403-4334</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-red-500" />
                <span className="text-xl">tyler@benchmarkequip.com</span>
              </div>
              
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <p className="text-xl">3310 Fort Worth Dr</p>
                  <p className="text-xl">Denton, TX 76205</p>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Clock className="w-6 h-6 text-red-500 mr-3" />
                Business Hours
              </h3>
              <div className="space-y-3 text-lg">
                <p>Monday - Friday: 7:00 AM - 5:00 PM</p>
                <p>Saturday: Closed</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-12">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-lg font-medium mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-lg font-medium mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-lg font-medium mb-3">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  required
                />
              </div>

              {/* Business/Company */}
              <div>
                <label htmlFor="business" className="block text-lg font-medium mb-3">
                  Business/Company
                </label>
                <input
                  type="text"
                  id="business"
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                />
              </div>

              {/* Request */}
              <div>
                <label htmlFor="request" className="block text-lg font-medium mb-3">
                  Request
                </label>
                <textarea
                  id="request"
                  name="request"
                  value={formData.request}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-800 border border-green-600 rounded-lg text-green-100">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-800 border border-red-600 rounded-lg text-red-100">
                  There was an error sending your message. Please try again or call us directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;