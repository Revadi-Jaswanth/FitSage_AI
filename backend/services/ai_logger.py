import os
import json
import logging
from datetime import datetime

# Setup logs directory
LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs")
os.makedirs(LOGS_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOGS_DIR, "ai_metrics.log")

# Setup console logger
logger = logging.getLogger("FitSage_AI")
logger.setLevel(logging.INFO)

if not logger.handlers:
    ch = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

def log_ai_metric(
    prompt_type,
    latency_seconds,
    cache_status,
    retry_count,
    validation_status,
    model_name,
    status,
    error_msg=None,
    token_count=None
):
    """
    Logs structured AI performance metrics in JSON Lines format to logs/ai_metrics.log.
    Guarantees no sensitive data (like prompts, credentials, or PII) is written to file.
    """
    timestamp = datetime.utcnow().isoformat()
    
    metric_entry = {
        "timestamp": timestamp,
        "prompt_type": prompt_type,
        "latency_seconds": round(latency_seconds, 3),
        "cache_status": cache_status,  # "HIT" or "MISS"
        "retry_count": retry_count,
        "validation_status": "SUCCESS" if validation_status else "FAILED",
        "model_name": model_name,
        "status": status,  # "SUCCESS" or "ERROR"
        "error_msg": error_msg,
        "estimated_tokens": token_count
    }
    
    try:
        with open(LOG_FILE, "a") as f:
            f.write(json.dumps(metric_entry) + "\n")
    except Exception as e:
        logger.error(f"Failed to append to log file {LOG_FILE}: {e}")
        
    logger.info(
        f"[AI METRIC] Type: {prompt_type} | Status: {status} | Latency: {round(latency_seconds, 3)}s | "
        f"Cache: {cache_status} | Retries: {retry_count} | Model: {model_name}"
    )
