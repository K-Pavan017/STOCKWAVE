"""from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import mplfinance as mpf
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
import logging

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

SYMBOL_LOOKUP = pd.read_csv(
    "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/master/data/constituents.csv"
)
TRENDING_TICKERS = ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'NFLX', 'NVDA', 'META', 'INTC', 'BA', 'SPY', 'XOM']

def generate_candlestick_chart(data, prediction_days=30):
    df = data.tail(prediction_days)
    df.index.name = 'Date'
    fig, _ = mpf.plot(
        df,
        type='candle',
        returnfig=True,
        figsize=(6, 3),
        title=f"Candlestick Chart - Last {prediction_days} Days",
        style='yahoo'
    )
    buf = BytesIO()
    fig.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

def generate_price_prediction_chart(actual, predicted, ticker):
    plt.figure(figsize=(10, 5))
    plt.plot(range(len(actual)), actual, label='Historical Prices')
    plt.plot(range(len(actual), len(actual) + len(predicted)), predicted, label='Predicted Prices', linestyle='dashed')
    plt.title(f'{ticker} - Price Prediction')
    plt.xlabel('Days')
    plt.ylabel('Price (USD)')
    plt.legend()
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

def generate_one_year_overlay_chart(actual, predicted, ticker):
    trimmed_actual = actual[-len(predicted):]
    if len(trimmed_actual) != len(predicted):
        predicted = predicted[:len(trimmed_actual)]
    plt.figure(figsize=(10, 5))
    plt.plot(trimmed_actual, label='Actual Prices', color='blue')
    plt.plot(predicted, label='Predicted Prices', color='orange')  # Same line style, different color
    plt.title(f'{ticker} - 1-Year Actual vs Predicted')
    plt.xlabel('Days')
    plt.ylabel('Price (USD)')
    plt.legend()
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

def train_lstm_model(data, prediction_days, return_model=False):
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data.reshape(-1, 1))
    X_train, y_train = [], []

    for i in range(60, len(scaled_data) - prediction_days):
        X_train.append(scaled_data[i - 60:i, 0])
        y_train.append(scaled_data[i:i + prediction_days, 0])

    X_train = np.array(X_train)
    y_train = np.array(y_train)
    X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))

    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(60, 1)),
        LSTM(50),
        Dense(prediction_days)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X_train, y_train, epochs=10, batch_size=32, verbose=0)

    last_60_days = scaled_data[-60:]
    X_test = np.array([last_60_days]).reshape((1, 60, 1))
    prediction = model.predict(X_test)
    predicted_prices = scaler.inverse_transform(prediction)[0]

    if return_model:
        return predicted_prices, model, scaler
    return predicted_prices


@app.route('/api/predict')
def predict():
    ticker = request.args.get('ticker')
    days = request.args.get('days', default=30, type=int)

    if not ticker:
        return jsonify({'error': 'Ticker is required'}), 400
    if days <= 0 or days > 730:
        return jsonify({'error': 'Prediction range must be between 1 and 730 days'}), 400

    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period='2y')

        if df.empty:
            return jsonify({'error': 'Invalid ticker symbol'}), 404

        close_prices = df['Close'].values
        predictions, model, scaler = train_lstm_model(close_prices, days, return_model=True)

        price_chart = generate_price_prediction_chart(close_prices, predictions, ticker)
        candlestick_chart = generate_candlestick_chart(df, days)

        # Generate 1-Year comparison chart
        one_year_data = close_prices[-365:]
        one_year_scaled = scaler.transform(one_year_data.reshape(-1, 1))

        X_test = []
        for i in range(60, len(one_year_scaled)):
            X_test.append(one_year_scaled[i - 60:i, 0])
        X_test = np.array(X_test).reshape((len(X_test), 60, 1))
        one_year_pred_scaled = model.predict(X_test)
        one_year_predictions = scaler.inverse_transform(one_year_pred_scaled)

        one_year_chart = generate_one_year_overlay_chart(one_year_data[60:], one_year_predictions[:, 0], ticker)

        # Fetch company information
        try:
            stock_info = stock.info
            info = {
                'name': stock_info.get('longName', 'N/A'),
                'description': stock_info.get('longBusinessSummary', 'N/A'),
                'industry': stock_info.get('industry', 'N/A'),
                'marketCap': stock_info.get('marketCap', 'N/A'),
                'previousClose': stock_info.get('previousClose', 'N/A'),
                'open': stock_info.get('open', 'N/A'),
                'dayHigh': stock_info.get('dayHigh', 'N/A'),
                'dayLow': stock_info.get('dayLow', 'N/A'),
                'dividendRate': stock_info.get('dividendRate', 'N/A'),
                'dividendYield': stock_info.get('dividendYield', 'N/A'),
                'ipoDate': stock_info.get('ipoExpectedDate', 'N/A'),
                'profitMargins': stock_info.get('profitMargins', 'N/A'),
                'beta': stock_info.get('beta', 'N/A'),
                'risk': stock_info.get('recommendationKey', 'N/A')
            }
        except KeyError as e:
            logging.warning(f"KeyError: Missing key {e} in stock info for {ticker}")
            info = {'name': 'N/A', 'description': 'N/A'}

        except Exception as e:
            logging.warning(f"Stock info fetch failed for {ticker}: {e}")
            info = {'name': 'N/A', 'description': 'N/A'}

        return jsonify({
            'predictions': predictions.tolist(),
            'price_comparison_graph': price_chart,
            'candlestick_chart': candlestick_chart,
            'one_year_comparison_chart': one_year_chart,
            'info': info
        })
    except Exception as e:
        logging.error(f"Prediction error for {ticker}: {e}")
        return jsonify({'error': 'Failed to generate prediction'}), 500


@app.route('/api/trending')
def get_trending_stocks():
    try:
        data = []
        tickers = yf.download(" ".join(TRENDING_TICKERS), period='1d', interval='1m', group_by='ticker', threads=True)
        for symbol in TRENDING_TICKERS:
            df = tickers.get(symbol)
            if df is not None and not df.empty:
                current = round(df['Close'].iloc[-1], 2)
                opening = round(df['Open'].iloc[0], 2)
                change = round(((current - opening) / opening) * 100, 2)
                data.append({
                    'symbol': symbol,
                    'price': current,
                    'change': f"{'+' if change >= 0 else ''}{change}%"
                })
        return jsonify(data)
    except Exception as e:
        logging.error(f"Trending error: {e}")
        return jsonify([]), 500

@app.route('/api/top_losers')
def get_top_losers():
    losers = ['BA', 'XOM', 'NVDA', 'GOOGL', 'AMZN', 'META']
    try:
        data = []
        tickers = yf.download(" ".join(losers), period='1d', interval='1m', group_by='ticker', threads=True)
        for symbol in losers:
            df = tickers.get(symbol)
            if df is not None and not df.empty:
                current = round(df['Close'].iloc[-1], 2)
                opening = round(df['Open'].iloc[0], 2)
                change = round(((current - opening) / opening) * 100, 2)
                data.append({
                    'symbol': symbol,
                    'price': current,
                    'change': f"{'+' if change >= 0 else ''}{change}%"
                })
        return jsonify(data)
    except Exception as e:
        logging.error(f"Losers error: {e}")
        return jsonify([]), 500

@app.route('/api/search')
def search_tickers():
    query = request.args.get('ticker', '').upper()
    if not query:
        return jsonify([])

    matches = SYMBOL_LOOKUP[SYMBOL_LOOKUP['Symbol'].str.contains(query, na=False)]
    results = matches[['Symbol', 'Name']].rename(columns={'Symbol': 'symbol', 'Name': 'name'}).to_dict(orient='records')
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
"""
from flask import Flask, request, jsonify
import yfinance as yf

from flask_cors import CORS
import os
import pandas as pd
from stock_data import (
    fetch_company_info,
    get_trending_stocks,
    get_top_losers,
    search_tickers
)
from model import train_lstm_model, predict_next_days
from charts import (
    generate_next_30_days_prediction_chart,
    generate_candlestick_chart,
    generate_one_year_overlay_chart
)
from utils import setup_logger, is_valid_ticker, validate_prediction_days, handle_error

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)

# Setup logger
logger = setup_logger()

# Ensure data directory exists
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

def is_valid_ticker(ticker):
    try:
        data = yf.Ticker(ticker)
        hist = data.history(period="1d")
        return not hist.empty
    except Exception:
        return False

@app.route('/api/predict')
def predict():
    ticker = request.args.get('ticker')
    days = request.args.get('days', default=30, type=int)
    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400

    if not is_valid_ticker(ticker):
        logger.error(f"Invalid ticker: {ticker}")
        return jsonify(handle_error("Invalid ticker symbol", 400)), 400

    if not validate_prediction_days(days):
        logger.error(f"Invalid prediction range: {days}")
        return jsonify(handle_error("Prediction range must be between 1 and 730 days", 400)), 400

    try:
        # Train model and fetch data
        close_prices, predictions, model, scaler, df = train_lstm_model(ticker, days, return_model=True)

        # Ensure index is datetime
        if not isinstance(df.index, pd.DatetimeIndex):
            df.index = pd.to_datetime(df.index)

        # Generate charts
        candlestick_chart = generate_candlestick_chart(df, days)
        predicted_prices = predict_next_days(ticker, 30)
        next_30_days_chart = generate_next_30_days_prediction_chart(predicted_prices, ticker)

        one_year_data = close_prices[-365:] if len(close_prices) >= 365 else close_prices
        one_year_chart = generate_one_year_overlay_chart(one_year_data, predictions[:len(one_year_data)], ticker)

        # Fetch company info
        info = fetch_company_info(ticker)

        return jsonify({
            'predictions': predictions.tolist(),
            'candlestick_chart': candlestick_chart,
            'next_30_days_chart': next_30_days_chart,
            'one_year_comparison_chart': one_year_chart,
            'info': info
        })
    except Exception as e:
        logger.error(f"Prediction error for {ticker}: {e}", exc_info=True)
        return jsonify(handle_error("Failed to generate prediction", 500)), 500

@app.route('/api/trending')
def trending():
    try:
        return jsonify(get_trending_stocks())
    except Exception as e:
        logger.error(f"Trending error: {e}", exc_info=True)
        return jsonify([]), 500

@app.route('/api/top_losers')
def top_losers():
    try:
        return jsonify(get_top_losers())
    except Exception as e:
        logger.error(f"Top losers error: {e}", exc_info=True)
        return jsonify([]), 500

@app.route('/api/search')
def search():
    query = request.args.get('ticker', '').upper()
    if not query:
        return jsonify([])
    try:
        return jsonify(search_tickers(query))
    except Exception as e:
        logger.error(f"Search error: {e}", exc_info=True)
        return jsonify([]), 500

@app.route('/predict_chart/<string:ticker>', methods=['GET'])
def get_prediction_chart(ticker):
    try:
        predicted_prices = predict_next_days(ticker, 30)
        if not predicted_prices:
            return jsonify({'error': 'Prediction failed'}), 500

        chart = generate_next_30_days_prediction_chart(predicted_prices, ticker)
        if not chart:
            return jsonify({'error': 'Chart generation failed'}), 500

        return jsonify({'ticker': ticker, 'chart': chart})
    except Exception as e:
        logger.error(f"Chart prediction error for {ticker}: {e}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
