import logging

# Set up logging
def setup_logger():
    logger = logging.getLogger('stockwave')
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger

# Custom error handler
def handle_error(error_message, status_code=500):
    return {
        'error': error_message,
        'status_code': status_code
    }

# Check if ticker is valid (basic check, can be extended)
def is_valid_ticker(ticker):
    # Here we could implement more sophisticated validation like checking if the ticker exists
    if not ticker or len(ticker) < 1 or len(ticker) > 5:
        return False
    return True

# Data validation (can be extended as needed)
def validate_prediction_days(days):
    if days <= 0 or days > 730:
        return False
    return True
