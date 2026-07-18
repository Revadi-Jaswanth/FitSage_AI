from flask import Blueprint, request, g
from database import cursor, db
from auth import token_required
from services.ai_service import coach_chat
from utils.response import make_api_response

coach = Blueprint("coach", __name__)

@coach.route("/chat", methods=["POST"])
@token_required
def chat():
    data = request.json or {}
    email = g.user_email
    message = data.get("message")
    session_id = data.get("session_id", "default")
        
    # Check if profile completed
    cursor.execute("SELECT profile_completed FROM users WHERE email=%s", (email,))
    row = cursor.fetchone()
    if not row or not row[0]:
        return make_api_response(
            success=False,
            message="Profile must be completed first",
            errors={"profile": "Incomplete configuration"},
            status_code=400
        )
        
    res, status_code = coach_chat(cursor, db, email, message, session_id)
    if status_code == 200:
        return make_api_response(
            success=True,
            message="Chat message processed successfully",
            data=res,
            status_code=200
        )
    else:
        return make_api_response(
            success=False,
            message="Failed to process chat message",
            errors=res,
            status_code=status_code
        )

@coach.route("/history", methods=["GET"])
@token_required
def chat_history_new():
    email = g.user_email
    session_id = request.args.get("session_id")
        
    if session_id:
        # Fetch actual messages for a specific session ordered chronologically
        cursor.execute(
            """
            SELECT user_message, ai_response, created_at
            FROM coach_chat
            WHERE user_id = (SELECT id FROM users WHERE email=%s) AND session_id=%s
            ORDER BY created_at ASC
            """,
            (email, session_id)
        )
        chats = cursor.fetchall()
        result = []
        for chat in chats:
            result.append({
                "user_message": chat[0],
                "ai_response": chat[1],
                "date": str(chat[2])
            })
        return make_api_response(
            success=True,
            message="Session chat history retrieved successfully",
            data=result,
            status_code=200
        )
    else:
        # Fetch distinct sessions (recent chat threads) for sidebar list
        cursor.execute(
            """
            SELECT session_id, MIN(user_message) as title, MAX(created_at) as last_active
            FROM coach_chat
            WHERE user_id = (SELECT id FROM users WHERE email=%s)
            GROUP BY session_id
            ORDER BY last_active DESC
            """,
            (email,)
        )
        sessions = cursor.fetchall()
        result = []
        for s in sessions:
            title = s[1] or "New Conversation"
            if len(title) > 30:
                title = title[:27] + "..."
            result.append({
                "session_id": s[0],
                "title": title,
                "date": str(s[2])
            })
        return make_api_response(
            success=True,
            message="Chat sessions retrieved successfully",
            data=result,
            status_code=200
        )

@coach.route("/history/<email>", methods=["GET"])
@token_required
def chat_history(email):
    return chat_history_new()

@coach.route("/session/<session_id>", methods=["DELETE"])
@token_required
def delete_session(session_id):
    email = g.user_email
    cursor.execute(
        """
        DELETE FROM coach_chat
        WHERE user_id = (SELECT id FROM users WHERE email=%s) AND session_id=%s
        """,
        (email, session_id)
    )
    db.commit()
    return make_api_response(
        success=True,
        message="Chat session deleted successfully",
        status_code=200
    )