import { FaChartLine, FaBrain, FaDesktop } from "react-icons/fa";

export default function HowItWorks() {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-20 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto text-center animate-fadeInUp">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          How StockWave Predicts Tomorrow’s Market
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          Our platform combines real-time data, AI algorithms, and an intuitive dashboard to give you market foresight.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:scale-[1.03] animate-fadeInUpDelay1">
            <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Market Data</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We ingest live data streams from top exchanges to ensure up-to-date predictions and market responsiveness.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:scale-[1.03] animate-fadeInUpDelay2">
            <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
              <FaBrain />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI & LSTM Algorithms</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our models use deep learning (LSTM) to detect long-term patterns and predict future stock movements.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:scale-[1.03] animate-fadeInUpDelay3">
            <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
              <FaDesktop />
            </div>
            <h3 className="text-xl font-semibold mb-2">Intuitive Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize predictions with interactive charts, historical data overlays, and easy navigation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
