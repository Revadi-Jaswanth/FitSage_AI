from flask import Blueprint, request, g
from database import cursor, db
from auth import token_required
from utils.response import make_api_response

progress = Blueprint("progress", __name__)

@progress.route("/log", methods=["POST"])
@token_required
def log_progress():
    data = request.json or {}
    email = g.user_email

    cursor.execute(
        "SELECT id, profile_completed FROM users WHERE email=%s",
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

    if not user[1]:
        return make_api_response(
            success=False,
            message="Profile must be completed first",
            errors={"profile": "Incomplete configuration"},
            status_code=400
        )

    cursor.execute(
        """
        INSERT INTO progress
        (user_id, weight, water, workout_completed)
        VALUES (%s, %s, %s, %s)
        """,
        (
            user[0],
            data.get("weight"),
            data.get("water"),
            data.get("workout_completed")
        )
    )
    db.commit()

    return make_api_response(
        success=True,
        message="Progress Logged Successfully",
        data={},
        status_code=200
    )


@progress.route("/history", methods=["GET"])
@token_required
def get_history_new():
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

    cursor.execute(
        """
        SELECT weight,
               water,
               workout_completed,
               created_at
        FROM progress
        WHERE user_id=%s
        ORDER BY created_at DESC
        """,
        (user[0],)
    )
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "weight": row[0],
            "water": row[1],
            "workout_completed": row[2],
            "date": str(row[3])
        })

    return make_api_response(
        success=True,
        message="Progress history retrieved successfully",
        data=result,
        status_code=200
    )

@progress.route("/history/<email>", methods=["GET"])
@token_required
def get_history(email):
    return get_history_new()


@progress.route("/add", methods=["POST"])
@token_required
def add_progress():
    data = request.json or {}
    email = g.user_email

    weight = data.get("weight")
    water = data.get("water")
    workout_completed = data.get("workout_completed")

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

    cursor.execute("""
        INSERT INTO progress
        (user_id, weight, water, workout_completed)
        VALUES (%s, %s, %s, %s)
    """, (user[0], weight, water, workout_completed))
    db.commit()

    return make_api_response(
        success=True,
        message="Progress Saved",
        data={},
        status_code=200
    )