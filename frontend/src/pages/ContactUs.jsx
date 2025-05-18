import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, ArrowRight, ArrowUpRight, Send } from 'lucide-react';

import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

// Contact Us Page Component
export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Message sent successfully!');
  };
  
  // Animation for elements
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
  }, []);
  
  const animationClasses = (delay) => `transform transition-all duration-1000 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${delay}`;

  return (
    <><Navbar /><div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className={`text-center max-w-3xl mx-auto ${animationClasses("delay-100")}`}>
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-medium text-sm mb-4">
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            We'd Love to <span className="text-blue-600">Hear From You</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Have questions about our stock prediction technology? Want to learn more about how our AI can enhance your investment strategy? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="container mx-auto px-6 py-8">
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 ${animationClasses("delay-300")}`}>
          {[
            {
              icon: <Phone size={24} className="text-blue-600" />,
              title: "Call Us",
              info: "+1 (555) 123-4567",
              description: "Available Mon-Fri, 9AM-5PM ET"
            },
            {
              icon: <Mail size={24} className="text-blue-600" />,
              title: "Email Us",
              info: "support@stockai.tech",
              description: "We'll respond within 24 hours"
            },
            {
              icon: <MapPin size={24} className="text-blue-600" />,
              title: "Visit Us",
              info: "123 Innovation Drive",
              description: "Boston, MA 02110"
            }
          ].map((option, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-8 text-center transition-transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6">
                {option.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
              <div className="text-blue-600 font-medium mb-2">{option.info}</div>
              <p className="text-gray-600">{option.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Form and Map */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${animationClasses("delay-500")}`}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="John Doe"
                      required />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="example@email.com"
                      required />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="How can we help you?"
                      required />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Tell us what you need..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105 flex items-center justify-center"
                  >
                    Send Message
                    <Send size={18} className="ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-16">
        <div className={`text-center max-w-3xl mx-auto mb-12 ${animationClasses("delay-700")}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Find answers to common questions about our stock prediction platform and services.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${animationClasses("delay-900")}`}>
          {[
            {
              question: "How accurate are your stock predictions?",
              answer: "Our AI models consistently achieve over 90% accuracy in backtesting. Real-world performance may vary based on market conditions, but we continuously improve our algorithms to maintain high accuracy rates."
            },
            {
              question: "How is my data protected?",
              answer: "We implement bank-level encryption to protect all user data. We do not share your personal information with third parties, and all predictions are generated using anonymized data models."
            },
            {
              question: "Can I integrate StockAI with my existing trading platform?",
              answer: "Yes! We offer API access that allows seamless integration with most popular trading platforms and financial software. Contact our support team for specific integration guidance."
            },
            {
              question: "What financial markets do you cover?",
              answer: "We currently provide predictions for major US stock markets (NYSE, NASDAQ), with plans to expand to international markets and additional financial instruments in the near future."
            },
            {
              question: "How often are predictions updated?",
              answer: "Our standard service provides daily prediction updates. Premium users receive real-time updates throughout trading hours, with alerts for significant market shifts."
            },
            {
              question: "Do you offer educational resources?",
              answer: "Yes, we provide comprehensive educational resources including webinars, tutorials, and a knowledge base to help you understand our prediction methodology and make the most of our platform."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-12">
        <div className={`bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-center ${animationClasses("delay-1000")}`}>
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience the Future of Stock Prediction?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already using our AI-powered platform to make smarter investment decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition transform hover:scale-105 flex items-center">
              Sign Up Now
              <ArrowRight size={18} className="ml-2" />
            </button>
            <button className="border border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition flex items-center">
              Request a Demo
              <ArrowUpRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}