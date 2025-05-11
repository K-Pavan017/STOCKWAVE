import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

export default function PredictionPage() {
  const { ticker } = useParams();
  const [days, setDays] = useState(30);
  const [priceComparisonGraph, setPriceComparisonGraph] = useState(null);
  const [candlestickChart, setCandlestickChart] = useState(null);
  const [threeMonthComparisonChart, setThreeMonthComparisonChart] = useState(null); // NEW
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPrediction = async () => {
    if (!ticker) return;
    setLoading(true);
    setError('');
    setPriceComparisonGraph(null);
    setCandlestickChart(null);
    setThreeMonthComparisonChart(null); // NEW
    setInfo(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/predict?ticker=${ticker}&days=${days}`);
      const { price_comparison_graph, candlestick_chart, info: summary, industry, three_month_comparison_chart } = res.data;

      if (price_comparison_graph && candlestick_chart) {
        setPriceComparisonGraph(price_comparison_graph);
        setCandlestickChart(candlestick_chart);
        setThreeMonthComparisonChart(three_month_comparison_chart || null); // NEW

        setInfo({
          name: ticker.toUpperCase(),
          description: summary || "No description available.",
          industry: industry || "N/A"
        });
      } else {
        setError("No prediction data available.");
      }
    } catch (err) {
      console.error("❌ Error fetching prediction:", err);
      setError(err?.response?.data?.error || "Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [ticker, days]);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Predictions for {ticker.toUpperCase()}</h2>

      <Form className="mb-4">
        <Form.Group>
          <Form.Label>Prediction Duration</Form.Label>
          <Form.Control
            as="select"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            style={{ maxWidth: '200px' }}
          >
            <option value={30}>1 Month</option>
            <option value={60}>2 Months</option>
            <option value={90}>3 Months</option>
            <option value={180}>6 Months</option>
            <option value={365}>1 Year</option>
            <option value={730}>2 Years</option>
          </Form.Control>
        </Form.Group>
        <Button
          type="button"
          className="mt-2"
          variant="primary"
          onClick={fetchPrediction}
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict"}
        </Button>
      </Form>

      {loading && (
        <div className="my-4 text-center">
          <Spinner animation="border" role="status" />
          <p>Loading prediction...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && priceComparisonGraph && (
        <div className="mb-5">
          <h4>Original vs Predicted Prices</h4>
          <img
            src={`data:image/png;base64,${priceComparisonGraph}`}
            alt="Original vs Predicted Prices Chart"
            className="img-fluid border rounded"
          />
        </div>
      )}

      {!loading && candlestickChart && (
        <div className="mb-5">
          <h4>Candlestick Chart</h4>
          <img
            src={`data:image/png;base64,${candlestickChart}`}
            alt="Candlestick Chart"
            className="img-fluid border rounded"
          />
          <p className="text-muted">
            Shows opening, closing, high, and low prices over the last 30 days.
          </p>
        </div>
      )}

      {!loading && threeMonthComparisonChart && (
        <div className="mb-5">
          <h4>3-Month Actual vs Predicted Prices</h4>
          <img
            src={`data:image/png;base64,${threeMonthComparisonChart}`}
            alt="3-Month Prediction Comparison"
            className="img-fluid border rounded"
          />
          <p className="text-muted">This chart shows predicted vs actual prices over the past 90 days.</p>
        </div>
      )}

      {!loading && info && (
        <div className="mb-5">
          <h4>Company Info</h4>
          <p><strong>Name:</strong> {info.name}</p>
          <p><strong>Description:</strong> {info.description}</p>
          <p><strong>Industry:</strong> {info.industry}</p>
        </div>
      )}
    </div>
  );
}
