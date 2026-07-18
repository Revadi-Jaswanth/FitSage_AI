import uuid
from flask import Flask, g, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from database import teardown_db
from routes.auth_routes import auth
from routes.workout_routes import workout
from routes.meal_routes import meal
from routes.progress_routes import progress
from routes.dashboard_routes import dashboard
from routes.coach_routes import coach
from routes.recommendations_routes import recommendations
from routes.summary_routes import summary
from routes.health_routes import health_bp
from utils.response import make_api_response

app = Flask(__name__)

# Register database connection pool teardown
app.teardown_appcontext(teardown_db)

# Enable CORS
CORS(app)

from config import Config

# Request ID Generation Middleware
@app.before_request
def before_request():
    g.request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

# Append X-Request-ID to response headers
@app.after_request
def add_headers(response):
    response.headers["X-Request-ID"] = getattr(g, "request_id", str(uuid.uuid4()))
    return response

# Centralized Error Handlers
@app.errorhandler(Exception)
def handle_exception(e):
    if isinstance(e, HTTPException):
        return make_api_response(
            success=False,
            message=e.description,
            errors={"code": e.code},
            status_code=e.code
        )
    return make_api_response(
        success=False,
        message="Internal Server Error",
        errors={"detail": str(e)},
        status_code=500
    )

# API v1 Namespaces
app.register_blueprint(health_bp, url_prefix=Config.API_PREFIX)
app.register_blueprint(auth, url_prefix=f"{Config.API_PREFIX}/auth")
app.register_blueprint(workout, url_prefix=f"{Config.API_PREFIX}/workout")
app.register_blueprint(meal, url_prefix=f"{Config.API_PREFIX}/meal")
app.register_blueprint(progress, url_prefix=f"{Config.API_PREFIX}/progress")
app.register_blueprint(dashboard, url_prefix=f"{Config.API_PREFIX}/dashboard")
app.register_blueprint(coach, url_prefix=f"{Config.API_PREFIX}/coach")
app.register_blueprint(recommendations, url_prefix=f"{Config.API_PREFIX}/recommendations")
app.register_blueprint(summary, url_prefix=f"{Config.API_PREFIX}/summary")

# Legacy URL Compatibility Mappings (Deprecated)
app.register_blueprint(auth, url_prefix="/auth", name="auth_legacy")
app.register_blueprint(workout, url_prefix="/workout", name="workout_legacy")
app.register_blueprint(meal, url_prefix="/meal", name="meal_legacy")
app.register_blueprint(progress, url_prefix="/progress", name="progress_legacy")
app.register_blueprint(dashboard, url_prefix="/dashboard", name="dashboard_legacy")
app.register_blueprint(coach, url_prefix="/coach", name="coach_legacy")
app.register_blueprint(recommendations, url_prefix="/recommendations", name="recommendations_legacy")
app.register_blueprint(summary, url_prefix="/summary", name="summary_legacy")

@app.route("/")
def home():
    return "FitSage Running"

if __name__ == "__main__":
    app.run(debug=True)