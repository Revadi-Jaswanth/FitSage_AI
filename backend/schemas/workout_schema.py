WORKOUT_SCHEMA = {
    "type": "object",
    "properties": {
        "weekly_schedule": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "day": {"type": "integer"},
                    "title": {"type": "string"},
                    "difficulty": {"type": "string"},
                    "duration_minutes": {"type": "integer"},
                    "estimated_calories_burned": {"type": "integer"},
                    "target_muscle_groups": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "exercises": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "sets": {"type": "integer"},
                                "reps": {"type": "string"},
                                "rest_seconds": {"type": "integer"}
                            },
                            "required": ["name", "sets", "reps", "rest_seconds"]
                        }
                    }
                },
                "required": ["day", "title", "difficulty", "duration_minutes", "estimated_calories_burned", "target_muscle_groups", "exercises"]
            }
        }
    },
    "required": ["weekly_schedule"]
}
