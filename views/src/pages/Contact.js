import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, BookOpen, Clock, HelpCircle, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ fullName: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactDetails = [
    {
      title: 'Email Support',
      info: 'support@bookbazaar.com',
      description: 'For general inquiries and assistance',
      icon: <Mail className="w-8 h-8 text-orange-500" />,
    },
    {
      title: 'Customer Service',
      info: '+1 (555) 123-4567',
      description: 'Available Mon-Fri, 9AM-6PM EST',
      icon: <Phone className="w-8 h-8 text-orange-500" />,
    },
    {
      title: 'Main Bookstore',
      info: '123 Book Bazaar Lane, Library City, BK 56789',
      description: 'Visit our flagship store',
      icon: <MapPin className="w-8 h-8 text-orange-500" />,
    },
  ];

  const faqItems = [
    {
      question: 'What are your shipping policies?',
      answer: 'We offer free shipping on orders over $35. Standard shipping takes 3-5 business days, while express shipping is available for an additional fee.'
    },
    {
      question: 'How do I return a book?',
      answer: 'Returns are accepted within 30 days of purchase. Simply fill out the return form included with your order or contact our customer service team.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location.'
    }
  ];

  return (
    <div className="mx-auto bg-black/60 p-6 md:p-8 lg:p-12 text-gray-300">
      {/* Hero Section */}
      <header className="bg-gray-900 text-white text-center py-12 md:py-16 mt-20 rounded-lg shadow-xl mb-12 relative overflow-hidden border border-gray-800">
        <div className="relative z-10 px-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Get in Touch</h1>
          <p className="text-sm md:text-base max-w-lg mx-auto text-gray-400 mb-4">Have questions about our collection or need book recommendations? Our team of literary enthusiasts is ready to assist.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#message-form" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </a>
            <a href="#faq" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <HelpCircle className="w-4 h-4 mr-2" />
              View FAQs
            </a>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Details Cards */}
        <div className="lg:col-span-1 space-y-6">
          {contactDetails.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-900 p-6 rounded-lg shadow-md border-l-4 border-orange-600 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start">
                <div className="bg-gray-800 rounded-full p-3 mr-4">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-orange-400 font-medium">{item.info}</p>
                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Hours & Additional Info */}
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md border border-gray-700">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold">Business Hours</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="font-medium">9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-medium">10:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-medium">12:00 PM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2" id="message-form">
          <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Send className="w-6 h-6 mr-2 text-orange-500" />
              Send Us a Message
            </h2>
            
            {submitted ? (
              <div className="bg-gray-800 border-l-4 border-orange-500 p-4 mb-6 rounded-md flex items-center">
                <Check className="w-6 h-6 text-orange-500 mr-3" />
                <div>
                  <p className="text-white font-medium">Message sent successfully!</p>
                  <p className="text-gray-400 text-sm">We'll get back to you as soon as possible.</p>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-white"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2" htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-white"
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-white"
                  placeholder="Tell us how we can help..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="mb-12 bg-gray-900 p-8 rounded-lg shadow-md border border-gray-800">
        <div className="flex items-center mb-6">
          <HelpCircle className="w-6 h-6 text-orange-500 mr-2" />
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-6">
          {faqItems.map((item, idx) => (
            <div key={idx} className="border-b border-gray-700 pb-4 last:border-0">
              <h3 className="text-lg font-semibold text-orange-300 mb-2">{item.question}</h3>
              <p className="text-gray-400">{item.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-3">Can't find what you're looking for?</p>
          <a 
            href="/faq" 
            className="inline-flex items-center text-orange-400 hover:text-orange-300 font-medium"
          >
            <BookOpen className="w-5 h-5 mr-1" />
            Visit our complete FAQ page
          </a>
        </div>
      </section>

      {/* Map */}
      <section className="mb-12 bg-gray-900 p-6 rounded-lg shadow-md overflow-hidden border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Find Us</h2>
        <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 border border-gray-700">
          {/* Replace this div with an actual map integration */}
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <p>Interactive map would be displayed here</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 rounded-lg border-t border-gray-800 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-orange-500" />
              Book Bazaar
            </h2>
            <p className="text-gray-400">Discover, Connect, and Share Your Love for Books!</p>
          </div>
          <div className="text-right">
            <p className="mb-1">&copy; {new Date().getFullYear()} Book Bazaar. All rights reserved.</p>
            <div className="text-sm text-gray-400">
              <a href="/privacy" className="hover:text-orange-400 mr-4">Privacy Policy</a>
              <a href="/terms" className="hover:text-orange-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;