from flask import Flask, request, jsonify
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

# Initialize app and logging
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# Load S&P 500 symbols
SYMBOL_LOOKUP = pd.read_csv(
    "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/master/data/constituents.csv"
)
TRENDING_TICKERS = ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'NFLX', 'NVDA', 'META', 'INTC', 'BA', 'SPY', 'XOM']

# 🔷 Candlestick chart
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

# 🔷 Price vs Prediction chart
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

# 🔷 3-month comparison chart
def generate_three_month_chart(data, model, scaler):
    prediction_days = 90
    scaled_data = scaler.transform(data.reshape(-1, 1))

    X_test, y_true = [], []
    for i in range(60, 60 + prediction_days):
        X_test.append(scaled_data[i - 60:i, 0])
        y_true.append(scaled_data[i, 0])

    X_test = np.array(X_test).reshape((-1, 60, 1))
    predictions = model.predict(X_test)
    predicted_prices = scaler.inverse_transform(predictions.reshape(-1, 1)).flatten()
    actual_prices = scaler.inverse_transform(np.array(y_true).reshape(-1, 1)).flatten()

    plt.figure(figsize=(10, 4))
    plt.plot(actual_prices, label="Actual Prices", linewidth=2)
    plt.plot(predicted_prices, label="Predicted Prices", linestyle='dashed')
    plt.title("Actual vs Predicted - Last 3 Months")
    plt.xlabel("Days")
    plt.ylabel("Price (USD)")
    plt.legend()
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

# 🔷 LSTM model
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

# 🔷 Prediction Endpoint
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
        three_month_chart = generate_three_month_chart(close_prices, model, scaler)

        try:
            info = stock.info.get('longBusinessSummary', 'No info available')
        except Exception as e:
            logging.warning(f"Stock info fetch failed for {ticker}: {e}")
            info = 'No info available'

        return jsonify({
            'predictions': predictions.tolist(),
            'price_comparison_graph': price_chart,
            'candlestick_chart': candlestick_chart,
            'three_month_comparison_chart': three_month_chart,
            'info': info
        })
    except Exception as e:
        logging.error(f"Prediction error for {ticker}: {e}")
        return jsonify({'error': 'Failed to generate prediction'}), 500

# 🔷 Trending Stocks
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

# 🔷 Top Losers
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

# 🔷 Search Endpoint
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
