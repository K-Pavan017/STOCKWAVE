import os
import json
import logging
import numpy as np
import pandas as pd
import yfinance as yf
from keras.models import Sequential, load_model
from keras.layers import LSTM, Dense
from keras.callbacks import EarlyStopping
from sklearn.preprocessing import MinMaxScaler
import joblib

# === Constants ===
DATA_DIR = 'stock_data'
MODEL_DIR = 'models'
LOG_FILE = 'stock_predictor.log'

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# === Logger Setup ===
logger = logging.getLogger('StockPredictor')
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.FileHandler(LOG_FILE)
    handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    logger.addHandler(handler)

def sanitize_ticker_for_filename(ticker: str) -> str:
    return ticker.replace('.', '_')

def sanitize_datetime_index(df):
    if isinstance(df.index, pd.DatetimeIndex):
        if df.index.tz is not None:
            df.index = df.index.tz_localize(None)
    else:
        df.index = pd.to_datetime(df.index, utc=True)
    return df

def fetch_stock_data(ticker: str, period: str = '2y') -> pd.DataFrame:
    ticker = ticker.upper().strip()
    filepath = os.path.join(DATA_DIR, f"{ticker.replace('.', '_')}_{period}.csv")

    try:
        if os.path.exists(filepath):
            logger.info(f"Loading cached data for {ticker}")
            df = pd.read_csv(filepath, index_col=0, parse_dates=True)
        else:
            logger.info(f"Fetching new data for {ticker}")
            stock = yf.Ticker(ticker)
            df = stock.history(period=period)

            if df.empty or 'Close' not in df.columns:
                raise ValueError(f"No data or missing 'Close' prices for {ticker}.")

            df = sanitize_datetime_index(df)
            df.to_csv(filepath)

        df = sanitize_datetime_index(df)
        logger.info(f"Fetched {len(df)} rows for {ticker}. Sample:\n{df.head()}")
        return df

    except Exception as e:
        logger.error(f"Failed to fetch data for {ticker}: {e}")
        raise ValueError(f"Invalid or unsupported ticker: {ticker}")

def build_lstm_model(input_shape: tuple, output_size: int) -> Sequential:
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=input_shape),
        LSTM(50),
        Dense(output_size)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_lstm_model(ticker: str, prediction_days: int = 5, epochs: int = 10, return_model: bool = False):
    df = fetch_stock_data(ticker)
    close_prices = df['Close'].values.reshape(-1, 1)

    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(close_prices)

    X_train, y_train = [], []
    for i in range(60, len(scaled_data) - prediction_days):
        X_train.append(scaled_data[i - 60:i, 0])
        y_train.append(scaled_data[i:i + prediction_days, 0])

    if not X_train:
        raise ValueError("Insufficient data to train the model.")

    X_train = np.array(X_train).reshape((-1, 60, 1))
    y_train = np.array(y_train)

    model = build_lstm_model((60, 1), prediction_days)
    logger.info(f"Training model for {ticker} - X: {X_train.shape}, y: {y_train.shape}")

    early_stop = EarlyStopping(monitor='loss', patience=3)
    model.fit(X_train, y_train, epochs=epochs, batch_size=32, verbose=1, callbacks=[early_stop])

    safe_ticker = sanitize_ticker_for_filename(ticker)
    model_path = os.path.join(MODEL_DIR, f"{safe_ticker}_lstm_model.h5")
    scaler_path = os.path.join(MODEL_DIR, f"{safe_ticker}_scaler.pkl")
    model.save(model_path)
    joblib.dump(scaler, scaler_path)

    last_60_days = scaled_data[-60:]
    X_test = np.array([last_60_days]).reshape((1, 60, 1))
    prediction = model.predict(X_test)
    predicted_prices = scaler.inverse_transform(prediction)[0]

    logger.info(f"Predicted prices for {ticker}: {json.dumps(predicted_prices.tolist())}")

    if return_model:
        return close_prices.flatten(), predicted_prices, model, scaler, df
    return predicted_prices

def recursive_forecast(model, last_60_days: np.ndarray, scaler: MinMaxScaler, prediction_days: int):
    forecast = []
    input_seq = last_60_days.copy()

    for _ in range(prediction_days):
        input_array = np.array([input_seq]).reshape((1, 60, 1))
        next_scaled = model.predict(input_array, verbose=0)[0][0]
        next_price = scaler.inverse_transform([[next_scaled]])[0][0]
        forecast.append(next_price)

        input_seq = np.append(input_seq[1:], [[next_scaled]], axis=0)

    return forecast

def predict_next_days(ticker: str, prediction_days: int = 30):
    try:
        safe_ticker = sanitize_ticker_for_filename(ticker)
        model_path = os.path.join(MODEL_DIR, f"{safe_ticker}_lstm_model.h5")
        scaler_path = os.path.join(MODEL_DIR, f"{safe_ticker}_scaler.pkl")

        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            raise FileNotFoundError(f"Model or scaler not found for {ticker}. Please train the model first.")

        df = fetch_stock_data(ticker)
        close_prices = df['Close'].values.reshape(-1, 1)

        if len(close_prices) < 60:
            raise ValueError(f"Insufficient data for prediction. Required: 60+, Found: {len(close_prices)}")

        scaler = joblib.load(scaler_path)
        scaled_data = scaler.transform(close_prices)
        model = load_model(model_path)

        last_60 = scaled_data[-60:]
        forecast = recursive_forecast(model, last_60, scaler, prediction_days)

        logger.info(f"{ticker} forecast for next {prediction_days} days: {forecast}")
        return forecast

    except Exception as e:
        logger.error(f"Prediction error for {ticker}: {e}")
        print(f"Error: {e}")
        return None