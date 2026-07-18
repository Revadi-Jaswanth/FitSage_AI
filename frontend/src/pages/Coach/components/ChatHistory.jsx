import React from "react";
import { FaHistory, FaPlus, FaTrash } from "react-icons/fa";

export default function ChatHistory({ 
    history, 
    activeSessionId, 
    setActiveSessionId, 
    startNewChat, 
    handleDeleteSession 
}) {
    return (
        <aside className="chat-history-sidebar">
            <button 
                className="new-chat-btn" 
                onClick={startNewChat}
                aria-label="Start new chat session"
            >
                <FaPlus style={{ marginRight: "8px" }} />
                <span>New Chat</span>
            </button>

            <h3 className="history-title" style={{ marginTop: "var(--space-sm)" }}>
                <FaHistory />
                <span>Recent Chats</span>
            </h3>
            
            <div className="history-list">
                {history.map((item) => (
                    <div 
                        key={item.session_id} 
                        className={`history-item ${activeSessionId === item.session_id ? "active" : ""}`} 
                        onClick={() => setActiveSessionId(item.session_id)}
                        title={item.title}
                    >
                        <span className="session-title-text">{item.title}</span>
                        <button 
                            className="delete-session-btn" 
                            onClick={(e) => handleDeleteSession(e, item.session_id)}
                            aria-label="Delete chat session"
                            title="Delete Chat"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
                {history.length === 0 && (
                    <p style={{ fontSize: "11px", color: "var(--text-tertiary)", textAlign: "center", marginTop: "var(--space-md)" }}>
                        No chat logs yet
                    </p>
                )}
            </div>
        </aside>
    );
}
