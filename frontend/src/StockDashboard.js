import React, { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Card, Row, Col } from 'react-bootstrap';
import { FaChartLine, FaSearch, FaStar, FaEnvelope, FaUser, FaFire, FaMoon, FaSun } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function StockDashboard() {

  const navigate = useNavigate();
  const [ticker, setTicker] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [graph, setGraph] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [reviews] = useState([
    { name: "John Doe", text: "StockWave is amazing! It really helped me make smart investment choices.", rating: 5 },
    { name: "Jane Smith", text: "Great platform with real-time predictions and trending stocks!", rating: 4 },
    { name: "Paul Adams", text: "The UI is sleek, and the predictions are accurate. Highly recommend!", rating: 5 }
  ]);

  const handleInputChange = async (e) => {
    const input = e.target.value.toUpperCase();
    setTicker(input);

    if (input.length > 1) {
      try {
        const res = await axios.get(`/api/search?ticker=${input}`);
        setSuggestions(res.data || []);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = async () => {
    if (ticker) navigate(`/predict/${ticker}`);
    try {
      const res = await axios.get(`http://localhost:5000/api/predict?ticker=${ticker}&days=30`);
      setPredictions(res.data.predictions);
      setGraph(res.data.graph);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  useEffect(() => {
   const fetchTrendingStocks = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/trending');
    if (Array.isArray(res.data)) {
      setTrending(res.data);
    } else if (Array.isArray(res.data.stocks)) {
      // e.g., if your backend returns { stocks: [...] }
      setTrending(res.data.stocks);
    } else {
      setTrending([]);
    }
  } catch (error) {
    console.error("Error fetching trending stocks:", error);
    setTrending([]);
  }    
};
const fetchTopLosers = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/top_losers');
    if (Array.isArray(res.data)) {
      setTopLosers(res.data);
    } else if (Array.isArray(res.data.stocks)) {
      setTopLosers(res.data.stocks);
    } else {
      setTopLosers([]);
    }
  } catch (error) {
    console.error("Error fetching top losers:", error);
    setTopLosers([]);
  };

    };

    fetchTrendingStocks();
    fetchTopLosers();
    const intervalId = setInterval(() => {
      fetchTrendingStocks();
      fetchTopLosers();
    }, 30000);

  }, []);

  return (
    <div className={darkMode ? "bg-dark text-light" : "bg-light text-dark"} style={{ minHeight: '100vh' }}>
      <nav className={`navbar ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-white"} shadow`}>
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand fw-bold fs-4">
            <FaChartLine className="me-2 text-primary" /> StockWave
          </Link>
          <Button variant={darkMode ? "outline-light" : "outline-dark"} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </Button>
        </div>
      </nav>

      <div className="container py-4">
        <h2 className="mb-3">Search Stock Ticker</h2>
        <InputGroup className="mb-2">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Enter company ticker (e.g., AAPL)"
            value={ticker}
            onChange={handleInputChange}
          />
        </InputGroup>
        <Button className="mb-3" variant="primary" style={{ width: '150px' }} onClick={handleSearch}>
          Search
        </Button>

        {suggestions.length > 0 && (
          <ul className="list-group mb-4">
            {suggestions.map((s, i) => (
              <li key={i} className={`list-group-item ${darkMode ? "bg-secondary text-white" : ""}`}>
                {s.symbol} - {s.name}
              </li>
            ))}
          </ul>
        )}

        {graph && (
          <div className="text-center mb-5">
            <h4>Predicted Stock Prices for {ticker}</h4>
            <img
              src={`data:image/png;base64,${graph}`}
              alt="Prediction Chart"
              className="img-fluid border rounded"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        <h3 className="mb-3"><FaFire className="me-2 text-danger" /> Trending Stocks</h3>
        <div
          className="d-flex overflow-auto mb-4 p-3 rounded"
          style={{
            maxHeight: '250px',
            background: darkMode ? '#2b2b2b' : '#f8f9fa',
            border: '1px solid #ccc',
            scrollBehavior: 'smooth',
            whiteSpace: 'nowrap',
          }}
        >
          {Array.isArray(trending) && trending.length > 0 ? (
              trending.map((stock, idx) => (
              <Card
                key={idx}
                className={`me-3 shadow-sm ${darkMode ? "bg-secondary text-light" : "bg-white"}`}
                style={{
                  borderRadius: '12px',
                  width: '200px',
                  flex: '0 0 auto',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Card.Body>
                  <Card.Title className="fw-bold">{stock.symbol}</Card.Title>
                  <Card.Text>
                    Price: <strong>${stock.price.toFixed(2)}</strong>
                  </Card.Text>
                  <Card.Text className={stock.change.includes('+') ? 'text-success' : 'text-danger'}>
                    {stock.change}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-muted">Loading trending stocks...</div>
          )}
        </div>

        <h3 className="mb-3"><FaFire className="me-2 text-warning" /> Top Losers</h3>
        <div
          className="d-flex overflow-auto mb-4 p-3 rounded"
          style={{
            maxHeight: '250px',
            background: darkMode ? '#2b2b2b' : '#f8f9fa',
            border: '1px solid #ccc',
            scrollBehavior: 'smooth',
            whiteSpace: 'nowrap',
          }}
        >
          {topLosers.length > 0 ? (
            topLosers.map((stock, idx) => (
              <Card
                key={idx}
                className={`me-3 shadow-sm ${darkMode ? "bg-secondary text-light" : "bg-white"}`}
                style={{
                  borderRadius: '12px',
                  width: '200px',
                  flex: '0 0 auto',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Card.Body>
                  <Card.Title className="fw-bold">{stock.symbol}</Card.Title>
                  <Card.Text>
                    Price: <strong>${stock.price.toFixed(2)}</strong>
                  </Card.Text>
                  <Card.Text className={stock.change.includes('+') ? 'text-success' : 'text-danger'}>
                    {stock.change}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-muted">Loading top losers...</div>
          )}
        </div>

        {/* Contact Us and Rating Form Section */}
        <Row className="mb-5">
          <Col md={6} sm={12}>
            <h3 className="mt-5 mb-3"><FaEnvelope className="me-2 text-warning" /> Contact Us</h3>
            <Form style={{ maxWidth: '100%' }}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Your Message</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
              <Button variant="success" type="submit">Submit</Button>
            </Form>
          </Col>

          <Col md={6} sm={12}>
            <h3 className="mt-5 mb-3"><FaStar className="me-2 text-warning" /> Rate Your Experience</h3>
            <div className="d-flex gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={28} className="text-warning" />
              ))}
            </div>
            <Button variant="primary">Submit Rating</Button>
          </Col>
        </Row>

        <h3 className="mt-5 mb-3"><FaStar className="me-2 text-warning" /> User Reviews</h3>
        <div className="d-flex gap-4 mb-5 flex-wrap">
          {reviews.map((review, idx) => (
            <Card key={idx} className={`mb-3 ${darkMode ? "bg-secondary text-light" : "bg-light"}`} style={{ width: '300px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <Card.Body>
                <Card.Title className="fw-bold">{review.name}</Card.Title>
                <Card.Text>{review.text}</Card.Text>
                <Card.Text>
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} size={18} className="text-warning" />
                  ))}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>

        <footer className={`py-4 mt-4 ${darkMode ? "bg-black text-light" : "bg-light text-dark"}`}>
          <div className="container text-center">
            <p className="mb-0">© 2025 StockWave. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
