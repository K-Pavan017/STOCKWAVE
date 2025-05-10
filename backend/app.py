"""from flask import Flask, jsonify, request
import yfinance as yf
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Preloaded list of symbols and names (replace with DB or API for full-scale search)
SYMBOL_LOOKUP = pd.read_csv("https://raw.githubusercontent.com/datasets/s-and-p-500-companies/master/data/constituents.csv")

TRENDING_TICKERS = ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'NFLX', 'NVDA', 'META', 'INTC', 'BA', 'SPY', 'XOM']

@app.route('/api/trending')
def get_trending_stocks():
    try:
        data = []
        tickers = yf.download(tickers=" ".join(TRENDING_TICKERS), period='1d', interval='1m', group_by='ticker', threads=True)

        for symbol in TRENDING_TICKERS:
            df = tickers[symbol]
            if not df.empty:
                current_price = round(df['Close'].iloc[-1], 2)
                open_price = round(df['Open'].iloc[0], 2)
                percent_change = round(((current_price - open_price) / open_price) * 100, 2)
                data.append({
                    'symbol': symbol,
                    'price': current_price,
                    'change': f"{'+' if percent_change >= 0 else ''}{percent_change}%"
                })
        return jsonify(data)
    except Exception as e:
        print(f"Error fetching trending stocks: {e}")
        return jsonify([]), 500

@app.route('/api/top_losers')
def get_top_losers():
    try:
        data = []
        top_losers_tickers = ['BA', 'XOM', 'NVDA', 'GOOGL', 'AMZN', 'META']  # Example tickers for top losers
        tickers = yf.download(tickers=" ".join(top_losers_tickers), period='1d', interval='1m', group_by='ticker', threads=True)

        for symbol in top_losers_tickers:
            df = tickers[symbol]
            if not df.empty:
                current_price = round(df['Close'].iloc[-1], 2)
                open_price = round(df['Open'].iloc[0], 2)
                percent_change = round(((current_price - open_price) / open_price) * 100, 2)
                data.append({
                    'symbol': symbol,
                    'price': current_price,
                    'change': f"{'+' if percent_change >= 0 else ''}{percent_change}%"
                })
        return jsonify(data)
    except Exception as e:
        print(f"Error fetching top losers: {e}")
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
    app.run(debug=True) """


from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import mplfinance as mpf
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM

app = Flask(__name__)
CORS(app)

# Load S&P 500 symbols
SYMBOL_LOOKUP = pd.read_csv("https://raw.githubusercontent.com/datasets/s-and-p-500-companies/master/data/constituents.csv")
TRENDING_TICKERS = ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'NFLX', 'NVDA', 'META', 'INTC', 'BA', 'SPY', 'XOM']

# 🟩 Candlestick chart
def generate_candlestick_chart(data):
    df = data.tail(30)
    df.index.name = 'Date'
    fig, _ = mpf.plot(df, type='candle', returnfig=True, figsize=(10, 6),
                      title="Candlestick Chart (OHLC)")
    buf = BytesIO()
    fig.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

# 🟩 Original vs Predicted price chart
def generate_price_prediction_chart(actual, predicted, ticker):
    plt.figure(figsize=(10, 5))
    plt.plot(range(len(actual)), actual, label='Original Historical Prices')
    plt.plot(range(len(actual), len(actual) + len(predicted)), predicted, label='Predicted Prices', linestyle='dashed')
    plt.title(f'{ticker} - Original vs Predicted Prices')
    plt.xlabel('Days')
    plt.ylabel('Price')
    plt.legend()
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

# 🟩 LSTM training
def train_lstm_model(data, prediction_days):
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
    X_test = np.array([last_60_days])
    X_test = X_test.reshape((1, 60, 1))
    prediction = model.predict(X_test)
    return scaler.inverse_transform(prediction)[0]

# 🟩 Main prediction endpoint
@app.route('/api/predict')
def predict():
    ticker = request.args.get('ticker')
    days = int(request.args.get('days', 30))

    stock = yf.Ticker(ticker)
    df = stock.history(period='2y')

    if df.empty:
        return jsonify({'error': 'Invalid ticker symbol'}), 404

    close_prices = df['Close'].values
    predictions = train_lstm_model(close_prices, days)

    price_chart = generate_price_prediction_chart(close_prices, predictions, ticker)
    candlestick_chart = generate_candlestick_chart(df)

    return jsonify({
        'predictions': predictions.tolist(),
        'price_comparison_graph': price_chart,
        'candlestick_chart': candlestick_chart,
        'info': stock.info.get('longBusinessSummary', 'No info available')
    })

# 🟩 Trending stocks
@app.route('/api/trending')
def get_trending_stocks():
    try:
        data = []
        tickers = yf.download(" ".join(TRENDING_TICKERS), period='1d', interval='1m', group_by='ticker', threads=True)

        for symbol in TRENDING_TICKERS:
            try:
                df = tickers[symbol]
                if not df.empty:
                    current = round(df['Close'].iloc[-1], 2)
                    opening = round(df['Open'].iloc[0], 2)
                    change = round(((current - opening) / opening) * 100, 2)
                    data.append({
                        'symbol': symbol,
                        'price': current,
                        'change': f"{'+' if change >= 0 else ''}{change}%"
                    })
            except KeyError:
                continue
        return jsonify(data)
    except Exception as e:
        print(f"Trending Error: {e}")
        return jsonify([]), 500

# 🟩 Top losers
@app.route('/api/top_losers')
def get_top_losers():
    losers = ['BA', 'XOM', 'NVDA', 'GOOGL', 'AMZN', 'META']
    try:
        data = []
        tickers = yf.download(" ".join(losers), period='1d', interval='1m', group_by='ticker', threads=True)

        for symbol in losers:
            try:
                df = tickers[symbol]
                if not df.empty:
                    current = round(df['Close'].iloc[-1], 2)
                    opening = round(df['Open'].iloc[0], 2)
                    change = round(((current - opening) / opening) * 100, 2)
                    data.append({
                        'symbol': symbol,
                        'price': current,
                        'change': f"{'+' if change >= 0 else ''}{change}%"
                    })
            except KeyError:
                continue
        return jsonify(data)
    except Exception as e:
        print(f"Losers Error: {e}")
        return jsonify([]), 500

# 🟩 Search companies
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
