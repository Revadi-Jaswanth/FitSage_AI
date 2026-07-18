from flask import Blueprint
from database import cursor
from utils.response import make_api_response
import time

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health_check():
    db_status = "UP"
    try:
        # Check database connection
        cursor.execute("SELECT 1")
        cursor.fetchone()
    except Exception:
        db_status = "DOWN"
        
    return make_api_response(
        success=True,
        message="Healthy",
        data={
            "status": "UP",
            "database": db_status,
            "api": "UP",
            "environment": "production",
            "version": "1.0.0",
            "timestamp": int(time.time())
        }
    )
