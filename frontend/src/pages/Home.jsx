// Home.jsx
import React, { useState } from 'react';
import {
  FaChartLine, FaBrain, FaMobileAlt, FaApple, FaGooglePlay, FaSun, FaMoon, FaNewspaper,
} from 'react-icons/fa';
import { Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
// import LearnAndNewsSection from './LearnAndNewsSection';
import LearnAndNews from '../components/LearnAndNews';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <><NavBar></NavBar><div className={darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      <Hero darkMode={darkMode} setDarkMode={setDarkMode} />
      <HowItWorks />
      <LearnAndNews/>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">StockWave</h3>
            <p className="text-gray-400 mb-4">
              Making stock market predictions simple and insightful with AI-powered tools.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a href="#" key={i} className="hover:text-cyan-500 transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Predictions</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-white">API</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center"><Mail size={18} className="mr-2" /> support@stockwave.com</li>
              <li className="flex items-center"><Phone size={18} className="mr-2" /> +1 (888) 123-4567</li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
              <div className="flex">
                <input type="email" placeholder="Your email" className="w-full px-3 py-2 text-black rounded-l-md focus:ring-2 focus:ring-cyan-600 outline-none" />
                <button className="bg-cyan-600 px-4 py-2 rounded-r-md hover:bg-cyan-700 transition">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} StockWave. All rights reserved.</p>
          <p className="mt-2">Disclaimer: This website offers stock predictions based on AI models. This is not financial advice.</p>
        </div>
      </footer>
    </div></>
  );
}
