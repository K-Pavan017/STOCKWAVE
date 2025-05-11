import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { 
  FaChartLine, FaBrain, FaMobileAlt, FaUserCircle, 
  FaSignOutAlt, FaCog, FaQuestionCircle, FaBell,
  FaApple, FaGooglePlay, FaSun, FaMoon, FaNewspaper
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StockDashboard  from './StockDashboard';

export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const features = [
    { title: "Real-Time Data", desc: "Live market feeds with millisecond latency", icon: <FaChartLine size={40} /> },
    { title: "AI Predictions", desc: "Deep learning forecasts with confidence scores", icon: <FaBrain size={40} /> },
    { title: "Mobile App", desc: "Trade anywhere with iOS/Android apps", icon: <FaMobileAlt size={40} /> }
  ];

  const newsItems = [
    { title: "Market Rally Continues Amid Economic Recovery", time: "2 min ago" },
    { title: "Tech Stocks Lead Gains in Premarket Trading", time: "15 min ago" },
    { title: "Fed Signals Potential Rate Hike in Q4", time: "1 hour ago" }
  ];

  return (
    <div className={darkMode ? "bg-dark text-light" : "bg-light text-dark"} style={{ minHeight: '100vh' }}>
      {/* Navbar with Profile Dropdown */}
      <nav className={`navbar ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"} shadow-sm`}>
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold">
            <FaChartLine className="me-2" /> StockWave
          </Link>
          
          <div className="d-flex align-items-center">
            <Button 
              variant={darkMode ? "outline-light" : "outline-dark"} 
              className="me-3"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>
            
            <Dropdown show={showDropdown} onToggle={setShowDropdown}>
              <Dropdown.Toggle variant={darkMode ? "dark" : "light"} id="dropdown-profile">
                <FaUserCircle size={28} />
              </Dropdown.Toggle>
              <Dropdown.Menu className={`shadow-lg ${darkMode ? "bg-dark" : ""}`}>
                <Dropdown.Header className="d-flex align-items-center">
                  <FaUserCircle size={40} className="me-2 text-primary" />
                  <div>
                    <div className="fw-bold">John Doe</div>
                    <small className="text-muted">Premium Member</small>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/dashboard" className={darkMode ? "text-light" : ""}>
                  <FaChartLine className="me-2" /> Dashboard
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/notifications" className={darkMode ? "text-light" : ""}>
                  <FaBell className="me-2" /> Notifications
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings" className={darkMode ? "text-light" : ""}>
                  <FaCog className="me-2" /> Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/logout" className="text-danger">
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`py-5 ${darkMode ? "bg-dark" : "bg-primary text-white"}`}>
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-3">AI Stock Predictions</h1>
          <p className="lead mb-4">Get actionable market insights powered by deep learning</p>
          <div className="d-flex gap-3 justify-content-center">
            <Button variant="light" size="lg" as={Link} to="/dashboard">
              Go to Dashboard
            </Button>
            <Button variant="outline-light" size="lg" as={Link} to="/demo">
              Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Key Features</h2>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-4">
                <div className={`card h-100 border-0 ${darkMode ? "bg-secondary text-white" : "shadow-sm"}`}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p className={darkMode ? "text-light" : "text-muted"}>{f.desc}</p>
                    <Button variant="outline-primary" size="sm">Learn More</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App + News Section */}
      <section className={`py-5 ${darkMode ? "bg-dark" : "bg-light"}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h2 className="fw-bold mb-4">Trade On The Go</h2>
              <div className={`p-3 rounded-3 ${darkMode ? "bg-black" : "bg-white shadow-sm"}`} style={{ maxWidth: '320px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">StockVision</h5>
                  <small className="text-success">● Live</small>
                </div>
                <div className="p-3 border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">AAPL</h6>
                      <small className="text-muted">NASDAQ</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">$178.23</div>
                      <small className="text-success">+1.2%</small>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">TSLA</h6>
                      <small className="text-muted">NASDAQ</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">$712.45</div>
                      <small className="text-danger">-0.8%</small>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Button variant={darkMode ? "dark" : "light"} className="px-4">
                    <FaApple className="me-2" /> App Store
                  </Button>
                  <Button variant={darkMode ? "dark" : "light"} className="px-4">
                    <FaGooglePlay className="me-2" /> Play Store
                  </Button>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">Market News</h2>
              <div className={`rounded-3 overflow-hidden ${darkMode ? "bg-black" : "bg-white shadow-sm"}`}>
                {newsItems.map((news, index) => (
                  <div key={index} className={`p-4 ${index < newsItems.length - 1 ? "border-bottom" : ""}`}>
                    <div className="d-flex">
                      <FaNewspaper className="me-3 mt-1 text-primary" />
                      <div>
                        <h5 className="mb-1">{news.title}</h5>
                        <small className="text-muted">{news.time}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-4 ${darkMode ? "bg-black text-light" : "bg-light text-dark"}`}>
        <div className="container text-center">
          <p className="mb-0">© 2023 StockVision AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
