import uuid
from flask import g, jsonify

def make_api_response(success, message, data=None, errors=None, meta=None, status_code=200):
    """
    Standardizes all API responses to follow the exact production structure.
    """
    response_meta = {
        "request_id": getattr(g, "request_id", str(uuid.uuid4())),
        "api_version": "v1"
    }
    if meta:
        response_meta.update(meta)
        
    return jsonify({
        "success": success,
        "message": message,
        "data": data if success else None,
        "errors": errors if not success else None,
        "meta": response_meta
    }), status_code
