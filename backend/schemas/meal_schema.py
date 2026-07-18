MEAL_SCHEMA = {
    "type": "object",
    "properties": {
        "daily_meals": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "meal_type": {"type": "string"},
                    "name": {"type": "string"},
                    "calories": {"type": "integer"},
                    "protein_grams": {"type": "integer"},
                    "carbs_grams": {"type": "integer"},
                    "fat_grams": {"type": "integer"},
                    "preparation": {"type": "string"},
                    "ingredients": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "amount": {"type": "string"}
                              },
                            "required": ["name", "amount"]
                        }
                    }
                },
                "required": ["meal_type", "name", "calories", "protein_grams", "carbs_grams", "fat_grams", "preparation", "ingredients"]
            }
        },
        "shopping_list": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "item": {"type": "string"},
                    "amount": {"type": "string"}
                },
                "required": ["item", "amount"]
            }
        }
    },
    "required": ["daily_meals", "shopping_list"]
}
