import os
import yfinance as yf
import pandas as pd

DATA_DIR = 'stock_data'

# Ensure the data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Predefined trending tickers
TRENDING_TICKERS = ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'NFLX', 'NVDA', 'INTC', 'BA', 'SPY', 'XOM']

def fetch_company_info(ticker: str) -> dict:
    """
    Fetches company info such as name, sector, and description using yfinance.
    Returns a dictionary with keys: name, sector, industry, website, description, marketCap.
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return {
            "name": info.get("shortName", "N/A"),
            "sector": info.get("sector", "N/A"),
            "industry": info.get("industry", "N/A"),
            "website": info.get("website", "N/A"),
            "description": info.get("longBusinessSummary", "N/A"),
            "marketCap": info.get("marketCap", "N/A"),
        }
    except Exception as e:
        print(f"Error fetching company info for {ticker}: {e}")
        return {
            "name": "N/A",
            "sector": "N/A",
            "industry": "N/A",
            "website": "N/A",
            "description": "N/A",
            "marketCap": "N/A",
        }

def fetch_stock_data(ticker: str, period: str = '2y') -> pd.DataFrame:
    """
    Fetches historical stock data for the given ticker and period.
    Caches data locally as CSV in DATA_DIR to avoid redundant downloads.
    Ensures the DataFrame index is a DatetimeIndex.
    """
    filepath = os.path.join(DATA_DIR, f"{ticker}_{period}.csv")

    if os.path.exists(filepath):
        print(f"Loading cached data from {filepath}")
        df = pd.read_csv(filepath, index_col=0, parse_dates=True)
    else:
        print(f"Fetching new data for {ticker}")
        df = yf.Ticker(ticker).history(period=period)
        if df.empty or 'Close' not in df.columns:
            raise ValueError(f"No historical data found or 'Close' prices missing for {ticker}.")
        df.to_csv(filepath)

    # Ensure the index is a DatetimeIndex
    if not isinstance(df.index, pd.DatetimeIndex):
        print("Converting index to DatetimeIndex...")
        df.index = pd.to_datetime(df.index)

    return df

def _get_stock_changes(ticker_list: list[str]) -> list[dict]:
    """
    Internal helper function to compute current price and percentage change
    for a list of tickers over the last trading day.
    """
    try:
        # Download 1 day data with 1-minute intervals, grouped by ticker
        tickers_data = yf.download(
            tickers=" ".join(ticker_list),
            period='1d',
            interval='1m',
            group_by='ticker',
            threads=True,
            progress=False
        )
        data = []
        for symbol in ticker_list:
            df = tickers_data.get(symbol)
            if df is not None and not df.empty:
                current = round(df['Close'].iloc[-1], 2)
                opening = round(df['Open'].iloc[0], 2)
                change = round(((current - opening) / opening) * 100, 2)
                data.append({
                    'symbol': symbol,
                    'price': current,
                    'change': f"{'+' if change >= 0 else ''}{change}%",
                })
            else:
                print(f"No recent data for {symbol}")
        return data
    except Exception as e:
        print(f"Error fetching data for tickers: {e}")
        return []

def get_trending_stocks() -> list[dict]:
    """
    Returns current price and % change for predefined trending tickers.
    """
    return _get_stock_changes(TRENDING_TICKERS)

def get_top_losers() -> list[dict]:
    """
    Returns current price and % change for predefined losing tickers.
    """
    losers = ['BA', 'XOM', 'NVDA', 'GOOGL', 'AMZN', 'NFLX', 'INTC']
    return _get_stock_changes(losers)

def search_tickers(query: str) -> list[dict]:
    """
    Searches the S&P 500 ticker dataset for matching symbols containing the query string.
    Returns a list of dicts with keys: 'symbol' and 'name'.
    """
    try:
        SYMBOL_LOOKUP = pd.read_csv(
            "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/master/data/constituents.csv"
        )
        matches = SYMBOL_LOOKUP[SYMBOL_LOOKUP['Symbol'].str.contains(query, case=False, na=False)]
        return matches[['Symbol', 'Name']].rename(columns={'Symbol': 'symbol', 'Name': 'name'}).to_dict(orient='records')
    except Exception as e:
        print(f"Error during ticker search: {e}")
        return []
