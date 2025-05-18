import { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown, ChevronRight, LineChart, BarChart, Users, Clock } from "lucide-react";
import { motion } from "framer-motion"; // Note: This is for animation example, but needs to be installed separately

export default function Hero() {
  const [symbol, setSymbol] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [tickerData, setTickerData] = useState([
    { symbol: "AAPL", price: "$175.23", change: "+2.3%", trending: "up" },
    { symbol: "GOOG", price: "$2,512.44", change: "-0.8%", trending: "down" },
    { symbol: "TSLA", price: "$846.90", change: "+4.2%", trending: "up" },
    { symbol: "AMZN", price: "$3,245.11", change: "-1.2%", trending: "down" },
    { symbol: "MSFT", price: "$336.75", change: "+1.8%", trending: "up" },
    { symbol: "META", price: "$325.18", change: "+3.1%", trending: "up" },
    { symbol: "NVDA", price: "$781.50", change: "+5.6%", trending: "up" },
    { symbol: "JPM", price: "$190.42", change: "-0.4%", trending: "down" }
  ]);

  // Simulate loading state for dashboard preview animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Ticker effect - Shift the first item to the end every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prevData => {
        const newData = [...prevData];
        const firstItem = newData.shift();
        if (firstItem) newData.push(firstItem);
        return newData;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    // Add logic to search or route to prediction page
    console.log("Search for:", symbol);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6 lg:px-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Stock Ticker */}
      <div className="absolute top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-sm border-b border-gray-700 text-sm font-medium py-2 px-4 overflow-hidden">
        <div className="flex space-x-8 animate-ticker whitespace-nowrap">
          {tickerData.map((stock, index) => (
            <div key={`${stock.symbol}-${index}`} className="flex items-center">
              <span className="font-semibold">{stock.symbol}:</span>
              <span className="ml-1">{stock.price}</span>
              <span className={`ml-1 flex items-center ${
                stock.trending === "up" ? "text-green-400" : "text-red-400"
              }`}>
                {stock.change}
                {stock.trending === "up" ? (
                  <TrendingUp size={14} className="ml-1" />
                ) : (
                  <TrendingDown size={14} className="ml-1" />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="pt-16 flex flex-col-reverse lg:flex-row items-center gap-12 relative z-10">
        {/* Left - Textual Content */}
        <div className="flex-1">
          <div className="inline-block px-3 py-1 mb-6 text-sm font-semibold text-blue-300 bg-blue-900 bg-opacity-30 rounded-full">
            #1 AI-Powered Stock Analysis Platform
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 text-transparent bg-clip-text">
            AI-Powered Stock Predictions
          </h1>
          
          <p className="text-lg lg:text-xl mb-8 text-gray-300 leading-relaxed">
            Insights, analytics, and foresight—all in one premium platform.
            Leverage machine learning to stay ahead of market trends and make smarter investments.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:translate-y-px hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 group">
              <span className="flex items-center">
                Get Started
                <ChevronRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
            
            <button className="px-8 py-3 border-2 border-gray-600 hover:border-blue-400 text-gray-200 hover:text-white rounded-xl font-semibold transition-all duration-300 hover:bg-gray-800 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
              <span className="flex items-center">
                View Predictions
                <LineChart size={18} className="ml-2" />
              </span>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative max-w-md mb-8">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search Stock Ticker (e.g. AAPL)"
                className="w-full py-4 pl-5 pr-12 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-30 transition-all duration-300"
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 bottom-0 px-4 bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-300 flex items-center justify-center"
              >
                <Search size={20} />
              </button>
            </div>
            
            {symbol && (
              <div className="absolute w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 transition-all duration-300 opacity-100 scale-100">
                <div className="p-3 border-b border-gray-700">
                  <div className="text-sm text-gray-400">Popular searches</div>
                </div>
                <div className="py-2">
                  {['AAPL', 'MSFT', 'GOOG', 'AMZN'].filter(s => s.includes(symbol.toUpperCase())).map((suggestion) => (
                    <div 
                      key={suggestion} 
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                      onClick={() => setSymbol(suggestion)}
                    >
                      <Search size={14} className="mr-2 text-gray-500" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Trust Signals */}
          <div className="flex flex-col space-y-4 text-sm text-gray-400">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="font-medium">92% prediction accuracy</span>
              </div>
              <div className="flex items-center">
                <Users size={16} className="mr-2 text-blue-400" />
                <span className="font-medium">Trusted by 10,000+ traders</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <BarChart size={16} className="mr-2 text-purple-400" />
                <span className="font-medium">Powered by LSTM models</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2 text-amber-400" />
                <span className="font-medium">10+ years of historical data</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right - Animated Dashboard Preview */}
        <div className="flex-1 w-full relative">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          
          <div className="relative bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            {/* Dashboard Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-400">StockWave Premium Dashboard</div>
              <div className="text-xs text-gray-500">TSLA • Advanced Analytics</div>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-6 h-80">
              {/* Chart UI */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold">TSLA</h3>
                  <div className="flex items-center">
                    <span className="text-xl font-semibold mr-2">$846.90</span>
                    <span className="text-green-400 flex items-center text-sm font-medium">
                      +4.2% <TrendingUp size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {["1D", "1W", "1M", "1Y", "ALL"].map((period) => (
                    <button 
                      key={period}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        period === "1M" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Chart SVG */}
              <div className="h-44 mt-4 relative">
                <svg
                  viewBox="0 0 400 100"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  {/* Chart gradient background */}
                  <defs>
                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Main chart line */}
                  <path
                    d={`M0,80 C30,75 60,68 100,60 S150,40 200,30 S300,20 350,30 L400,28 V100 H0 Z`}
                    fill="url(#chart-gradient)"
                    opacity={isLoaded ? "1" : "0"}
                    className="transition-opacity duration-1000"
                  />
                  
                  <path
                    d={`M0,80 C30,75 60,68 100,60 S150,40 200,30 S300,20 350,30 L400,28`}
                    stroke="#3B82F6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="400"
                    strokeDashoffset={isLoaded ? "0" : "400"}
                    className="transition-all duration-1500"
                  />
                  
                  {/* Chart data points */}
                  {isLoaded && (
                    <>
                      <circle cx="100" cy="60" r="3" fill="#3B82F6" />
                      <circle cx="200" cy="30" r="3" fill="#3B82F6" />
                      <circle cx="350" cy="30" r="3" fill="#3B82F6" />
                      <circle cx="350" cy="30" r="6" fill="transparent" stroke="#3B82F6" strokeWidth="1" className="animate-ping" />
                    </>
                  )}
                </svg>
                
                {/* Data loading overlay */}
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {/* Dashboard Stats */}
              {isLoaded && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {[
                    { label: "Open", value: "$823.40" },
                    { label: "Volume", value: "12.4M" },
                    { label: "High", value: "$851.20" },
                    { label: "AI Prediction", value: "↗ BUY", highlight: true }
                  ].map((stat, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        stat.highlight 
                          ? "bg-green-900 bg-opacity-30 border border-green-700" 
                          : "bg-gray-700 bg-opacity-50"
                      }`}
                    >
                      <div className="text-xs text-gray-400">{stat.label}</div>
                      <div className={`text-sm font-bold ${stat.highlight ? "text-green-400" : "text-white"}`}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS for animations (in a real application this would go in your stylesheet) */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-blob {
          animation: blob 7s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </section>
  );
}