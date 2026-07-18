RECOMMENDATION_SCHEMA = {
    "type": "object",
    "properties": {
        "recommendations": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "category": {"type": "string"},
                    "priority": {"type": "string"},
                    "description": {"type": "string"},
                    "reason": {"type": "string"}
                },
                "required": ["category", "priority", "description", "reason"]
            }
        }
    },
    "required": ["recommendations"]
}
