import os
import jwt
import datetime
from functools import wraps
from flask import request, jsonify, g
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.environ.get("JWT_SECRET", "default_secret_key_change_me")

def generate_tokens(email, role="user"):
    """
    Generates a pair of access and refresh tokens.
    Access Token: expires in 15 minutes.
    Refresh Token: expires in 7 days.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    
    access_payload = {
        "email": email,
        "role": role,
        "type": "access",
        "exp": now + datetime.timedelta(minutes=15)
    }
    
    refresh_payload = {
        "email": email,
        "role": role,
        "type": "refresh",
        "exp": now + datetime.timedelta(days=7)
    }
    
    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm="HS256")
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

def token_required(f):
    """
    Decorator to ensure access token is supplied and is valid.
    Sets g.user_email and g.user_role upon success.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization")
        
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == "bearer":
                token = parts[1]
                
        if not token:
            return jsonify({
                "success": False,
                "message": "Authorization token is missing",
                "errors": {"auth": "Token missing from headers"}
            }), 401
            
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            if payload.get("type") != "access":
                return jsonify({
                    "success": False,
                    "message": "Invalid token type, access token required",
                    "errors": {"auth": "Incorrect token type"}
                }), 401
                
            g.user_email = payload["email"]
            g.user_role = payload.get("role", "user")
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "message": "Access token has expired",
                "errors": {"auth": "Token expired"}
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "message": "Invalid authorization token",
                "errors": {"auth": "Token decoding failed"}
            }), 401
            
        return f(*args, **kwargs)
    return decorated

def roles_required(*roles):
    """
    Decorator to check if user has required permissions.
    Should be placed AFTER @token_required.
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user_role = getattr(g, "user_role", None)
            if not user_role or user_role not in roles:
                return jsonify({
                    "success": False,
                    "message": "Access denied: insufficient permissions",
                    "errors": {"auth": f"Required role(s): {', '.join(roles)}"}
                }), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
