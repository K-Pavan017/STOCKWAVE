import React from 'react';
import { motion } from 'framer-motion';
import { FaYoutube, FaBookOpen, FaInstagram, FaExternalLinkAlt, FaNewspaper } from 'react-icons/fa';

export default function LearnAndNews() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Expand Your Trading Knowledge
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Premium educational resources and market insights curated for serious traders
          </p>
        </motion.div>

        {/* Tutorials Section */}
        <div>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📚</span> Learn Stock Market & Trading
          </motion.h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "Stock Market for Beginners",
                description: "Master the fundamentals of stock markets and start your investing journey",
                link: "https://www.youtube.com/watch?v=p7HKvqRI_Bo",
                thumbnail: "/api/placeholder/640/360",
              },
              {
                title: "How to Trade Stocks",
                description: "Learn effective trading strategies from industry professionals",
                link: "https://www.youtube.com/watch?v=4CQzOXbkLqY",
                thumbnail: "/api/placeholder/640/360",
              },
              {
                title: "Technical Analysis Basics",
                description: "Understand charts, indicators and patterns for better trading decisions",
                link: "https://www.youtube.com/watch?v=eynxyoKgpng",
                thumbnail: "/api/placeholder/640/360",
              },
            ].map((video, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="relative">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.8 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        className="bg-white/90 p-3 rounded-full"
                      >
                        <FaYoutube size={30} className="text-red-600" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">{video.title}</h3>
                    <p className="text-gray-600">{video.description}</p>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* News & Blogs Section */}
        <div>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📰</span> Market News & Trading Buzz
          </motion.h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* Blog Post */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <a
                href="https://www.investopedia.com/articles/basics/06/invest1000.asp"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <FaBookOpen size={24} className="text-indigo-600" />
                  </div>
                  <motion.div 
                    className="ml-auto"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1, x: -4 }}
                  >
                    <FaExternalLinkAlt className="text-indigo-400" />
                  </motion.div>
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">How to Invest Your First $1000</h4>
                <p className="text-gray-600">Beginner-friendly guide from Investopedia on starting with small capital. Learn strategic approaches to maximize your initial investment.</p>
              </a>
            </motion.div>

            {/* Instagram Post */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <a
                href="https://www.instagram.com/tradingview/"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-pink-100 rounded-full">
                    <FaInstagram size={24} className="text-pink-600" />
                  </div>
                  <motion.div 
                    className="ml-auto"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1, x: -4 }}
                  >
                    <FaExternalLinkAlt className="text-pink-400" />
                  </motion.div>
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">TradingView IG Insights</h4>
                <p className="text-gray-600">Catch daily charts, signals, and analysis from TradingView's Instagram. Stay updated with visual market insights and expert commentary.</p>
              </a>
            </motion.div>

            {/* Financial Times News */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <a
                href="https://www.ft.com/markets"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaNewspaper size={24} className="text-blue-600" />
                  </div>
                  <motion.div 
                    className="ml-auto"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1, x: -4 }}
                  >
                    <FaExternalLinkAlt className="text-blue-400" />
                  </motion.div>
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">Latest from Financial Times</h4>
                <p className="text-gray-600">Live updates on stock indices, interest rates, and tech sector movement. Get professional coverage of global financial markets.</p>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <a 
              href="#newsletter" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Daily Market Insights
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}