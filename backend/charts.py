import base64
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend for server environments
import matplotlib.pyplot as plt
import mplfinance as mpf
from io import BytesIO

def generate_candlestick_chart(data, prediction_days=30):
    """
    Generates a base64-encoded PNG candlestick chart for the last 'prediction_days' days.
    :param data: Pandas DataFrame with stock OHLC data.
    :param prediction_days: Number of days to show on the chart.
    :return: base64-encoded PNG image string or None on error.
    """
    if data.empty:
        print("Error: Data is empty.")
        return None

    df = data.tail(prediction_days)
    if df.empty:
        print("Error: Insufficient data for candlestick chart.")
        return None

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
    encoded = base64.b64encode(buf.read()).decode('utf-8')
    return encoded



def generate_next_30_days_prediction_chart(predicted, ticker):
    """
    Generates a base64-encoded PNG line chart for the next 30 days predicted stock prices.
    :param predicted: List or array of predicted prices (must be at least 30 elements).
    :param ticker: Stock ticker symbol string.
    :return: base64-encoded PNG image string or None on error.
    """
    if predicted is None or len(predicted) < 30:
        print("Error: Predicted data must contain at least 30 values.")
        return None

    next_30 = predicted[:30]

    plt.figure(figsize=(10, 4))
    plt.plot(range(1, 31), next_30, color='green', marker='o', linestyle='-', linewidth=2, label='Predicted Price')
    plt.title(f'{ticker} - Next 30 Days Price Prediction', fontsize=14)
    plt.xlabel('Day', fontsize=12)
    plt.ylabel('Price (USD)', fontsize=12)
    plt.xticks(range(1, 31, 2))
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.legend()

    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode('utf-8')
    return encoded

def generate_one_year_overlay_chart(actual, predicted, ticker, num_days=365):
    """
    Generates a base64-encoded PNG overlay chart comparing actual prices with predictions
    over a user-specified number of days.
    If predicted data is shorter than num_days, pads with last predicted value.

    :param actual: List or array of historical prices (must be at least num_days).
    :param predicted: List or array of predicted prices.
    :param ticker: Stock ticker symbol string.
    :param num_days: Number of days to plot (default 365).
    :return: base64-encoded PNG image string or None on error.
    """
    if actual is None or len(actual) < num_days:
        print(f"Error: Insufficient actual data for {num_days} days.")
        return None

    trimmed_actual = actual[-num_days:]

    if predicted is None or len(predicted) == 0:
        print("Error: Predicted data is empty or None.")
        return None

    # Pad predicted data to num_days if needed
    if len(predicted) < num_days:
        predicted = list(predicted) + [predicted[-1]] * (num_days - len(predicted))

    if len(predicted) != num_days:
        print("Error: Predicted data length mismatch after padding.")
        return None

    plt.figure(figsize=(12, 6))
    plt.plot(trimmed_actual, label='Actual Prices', color='blue', linestyle='-', linewidth=2)
    plt.plot(predicted, label='Predicted Prices', color='orange', linestyle='-', linewidth=2)
    plt.title(f'{ticker} - Last {num_days} Days Actual vs Predicted', fontsize=16)
    plt.xlabel('Days', fontsize=14)
    plt.ylabel('Price (USD)', fontsize=14)
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.tight_layout()

    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode('utf-8')
    return encoded
