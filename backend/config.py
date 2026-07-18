import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    JWT_SECRET = os.environ.get("JWT_SECRET", "default_secret_key_change_me")
    
    DB_HOST = os.environ.get("DB_HOST", "localhost")
    DB_USER = os.environ.get("DB_USER", "root")
    DB_PASSWORD = os.environ.get("DB_PASSWORD", "pass123")
    DB_NAME = os.environ.get("DB_NAME", "fitsage_ai")
    DB_PORT = int(os.environ.get("DB_PORT", 3306))
    
    AI_MODEL = os.environ.get("AI_MODEL", "gemini-2.5-flash")
    AI_TEMPERATURE = float(os.environ.get("AI_TEMPERATURE", "0.6"))
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    
    API_VERSION = "v1"
    API_PREFIX = "/api/v1"
