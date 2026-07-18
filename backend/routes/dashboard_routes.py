from flask import Blueprint, jsonify, g
from database import cursor
from auth import token_required

dashboard = Blueprint("dashboard", __name__)

from utils.response import make_api_response

@dashboard.route("/stats", methods=["GET"])
@token_required
def get_stats_new():
    email = g.user_email

    cursor.execute(
        "SELECT id FROM users WHERE email=%s",
        (email,)
    )
    user = cursor.fetchone()
    
    if not user:
        return make_api_response(
            success=False,
            message="User not found",
            errors={"user": "User record does not exist"},
            status_code=404
        )

    user_id = user[0]

    cursor.execute("""
        SELECT weight
        FROM progress
        WHERE user_id=%s
        ORDER BY created_at DESC
        LIMIT 1
    """, (user_id,))
    weight = cursor.fetchone()

    cursor.execute("""
        SELECT COUNT(*)
        FROM progress
        WHERE user_id=%s
        AND workout_completed=1
    """, (user_id,))
    workouts = cursor.fetchone()

    cursor.execute("""
        SELECT AVG(water)
        FROM progress
        WHERE user_id=%s
    """, (user_id,))
    avg_water = cursor.fetchone()

    return make_api_response(
        success=True,
        message="Dashboard stats retrieved successfully",
        data={
            "current_weight": weight[0] if weight else 0,
            "workouts_completed": workouts[0] if workouts else 0,
            "average_water": round(avg_water[0], 2) if avg_water and avg_water[0] else 0
        },
        status_code=200
    )

@dashboard.route("/stats/<email>", methods=["GET"])
@token_required
def get_stats(email):
    return get_stats_new()