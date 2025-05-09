from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Dummy S&P 500 symbols for demo purposes
sp500_symbols = [
    {"symbol": "AAPL", "name": "Apple Inc."},
    {"symbol": "TSLA", "name": "Tesla Inc."},
    {"symbol": "MSFT", "name": "Microsoft Corporation"},
    {"symbol": "GOOGL", "name": "Alphabet Inc."},
    {"symbol": "AMZN", "name": "Amazon.com Inc."},
]

@app.route('/api/search_ticker', methods=['GET'])
def search_ticker():
    query = request.args.get('ticker', '').upper()
    if not query:
        return jsonify([])

    matches = [
        stock for stock in sp500_symbols
        if query in stock['symbol'] or query in stock['name'].upper()
    ]
    return jsonify(matches)

@app.route('/api/trending_stocks', methods=['GET'])
def trending_stocks():
    symbols = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN']
    data = []
    try:
        for sym in symbols:
            ticker = yf.Ticker(sym)
            info = ticker.info
            data.append({
                'symbol': sym,
                'price': info.get('regularMarketPrice', 'N/A'),
                'change': info.get('regularMarketChangePercent', 0)
            })
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
