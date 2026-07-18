COACH_SCHEMA = {
    "type": "object",
    "properties": {
        "answer": {"type": "string"},
        "tips": {
            "type": "array",
            "items": {"type": "string"}
        },
        "warnings": {
            "type": "array",
            "items": {"type": "string"}
        },
        "motivation": {"type": "string"},
        "suggested_next_actions": {
            "type": "array",
            "items": {"type": "string"}
        }
    },
    "required": ["answer", "tips", "warnings", "motivation", "suggested_next_actions"]
}
