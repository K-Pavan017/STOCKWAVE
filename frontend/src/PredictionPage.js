import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spinner, Alert, ButtonGroup, Button } from 'react-bootstrap';

export default function PredictionPage() {
  const { ticker } = useParams();
  const [days, setDays] = useState(30);
  const [priceChart, setPriceChart] = useState(null);
  const [candlestickChart, setCandlestickChart] = useState(null);
  const [oneYearChart, setOneYearChart] = useState(null);
  const [next30Chart, setNext30Chart] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const formatNumber = (num) => {
    if (typeof num === 'number') return num.toLocaleString();
    return num;
  };

  const formatPercent = (num) => {
    if (typeof num === 'number') return `${(num * 100).toFixed(2)}%`;
    return num;
  };

  const fetchPrediction = async () => {
    if (!ticker) {
      setError('No ticker symbol provided.');
      return;
    }

    setLoading(true);
    setError('');
    setPriceChart(null);
    setCandlestickChart(null);
    setOneYearChart(null);
    setNext30Chart(null);
    setInfo(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/predict?ticker=${ticker}&days=${days}`);
      const data = res.data;

      setPriceChart(data.price_comparison_graph);
      setCandlestickChart(data.candlestick_chart);
      setOneYearChart(data.one_year_comparison_chart);
      setNext30Chart(data.next_30_days_chart);
      setInfo(data.info || 'No info available');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch prediction.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticker) {
      fetchPrediction();
    }
  }, [ticker, days]);

  const dayOptions = [
    { label: '1 Day', value: 1 },
    { label: '1 Week', value: 7 },
    { label: '1 Month', value: 30 },
    { label: '3 Months', value: 90 },
    { label: '6 Months', value: 180 },
    { label: '1 Year', value: 365 },
  ];

  // Style objects for dark/light mode
  const containerStyle = {
    backgroundColor: darkMode ? '#121212' : '#fff',
    color: darkMode ? '#e0e0e0' : '#212529',
    minHeight: '100vh',
    paddingBottom: '3rem',
    transition: 'all 0.3s ease',
  };

  const buttonVariant = darkMode ? 'outline-light' : 'outline-success';

  return (
    <div className="container py-4" style={containerStyle}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Predictions for {ticker?.toUpperCase()}</h2>
        <Button
          variant={darkMode ? 'light' : 'dark'}
          onClick={() => setDarkMode(!darkMode)}
          style={{ minWidth: '120px' }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>

      <div className="my-3 d-flex flex-wrap align-items-center justify-content-start gap-3">
        <div>
          <label className="mb-2 d-block"><strong>Prediction Duration</strong></label>
          <ButtonGroup aria-label="Prediction duration buttons">
            {dayOptions.map(({ label, value }) => (
              <Button
                key={value}
                variant={days === value ? 'success' : buttonVariant}
                onClick={() => setDays(value)}
                disabled={loading}
                style={{ minWidth: '80px' }}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <div style={{ marginTop: '28px' }}>
          <Button
            onClick={fetchPrediction}
            disabled={loading}
            variant={darkMode ? 'light' : 'success'}
            style={{ minWidth: '130px', height: '38px' }}
          >
            {loading ? 'Predicting...' : 'Predict'}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="my-4 text-center">
          <Spinner animation="border" variant={darkMode ? 'light' : 'primary'} />
          <p>Loading prediction...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {next30Chart && (
        <div className="mb-5">
          <h4>Next 30 Days Price Prediction</h4>
          <img
            src={`data:image/png;base64,${next30Chart}`}
            alt="Next 30 Days Chart"
            className="img-fluid border rounded"
            style={{ borderColor: darkMode ? '#444' : undefined }}
          />
        </div>
      )}

      {candlestickChart && (
        <div className="mb-5">
          <h4>Candlestick Chart</h4>
          <img
            src={`data:image/png;base64,${candlestickChart}`}
            alt="Candlestick Chart"
            className="img-fluid border rounded"
            style={{ borderColor: darkMode ? '#444' : undefined }}
          />
        </div>
      )}

      {oneYearChart && (
        <div className="mb-5">
          <h4>1-Year Actual vs Predicted</h4>
          <img
            src={`data:image/png;base64,${oneYearChart}`}
            alt="1-Year Chart"
            className="img-fluid border rounded"
            style={{ borderColor: darkMode ? '#444' : undefined }}
          />
        </div>
      )}

      {!loading && info && (
        <div className="mb-5">
          <h4>Company Info</h4>
          {info && info !== 'No info available' ? (
            <>
              <p><strong>Name:</strong> {info.name}</p>
              <p><strong>Description:</strong> {info.description}</p>
              <p><strong>Industry:</strong> {info.industry}</p>
              <p><strong>Market Cap:</strong> {formatNumber(info.marketCap)}</p>
              <p><strong>Previous Close:</strong> {formatNumber(info.previousClose)}</p>
              <p><strong>Open:</strong> {formatNumber(info.open)}</p>
              <p><strong>Day High:</strong> {formatNumber(info.dayHigh)}</p>
              <p><strong>Day Low:</strong> {formatNumber(info.dayLow)}</p>
              <p><strong>Dividend Rate:</strong> {formatNumber(info.dividendRate)}</p>
              <p><strong>Dividend Yield:</strong> {formatPercent(info.dividendYield)}</p>
              <p><strong>IPO Date:</strong> {info.ipoDate}</p>
              <p><strong>Profit Margins:</strong> {formatPercent(info.profitMargins)}</p>
              <p><strong>Beta:</strong> {info.beta}</p>
              <p><strong>Risk:</strong> {info.risk}</p>
            </>
          ) : (
            <p>No company info available.</p>
          )}
        </div>
      )}
    </div>
  );
}
