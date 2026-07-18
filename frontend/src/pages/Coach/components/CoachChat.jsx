import React, { lazy, Suspense } from "react";
import Avatar from "../../../components/ui/Avatar";
import { FaCopy, FaVolumeUp, FaPaperPlane } from "react-icons/fa";

const SuggestedPrompts = lazy(() => import("./SuggestedPrompts"));
const Markdown = lazy(() => import("../../../components/ui/Markdown"));

export default function CoachChat({
    messages,
    message,
    setMessage,
    loading,
    handleSend,
    copyToClipboard,
    speakResponse,
    messagesEndRef
}) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-canvas">
            <div className="chat-messages-thread">
                {messages.length === 0 ? (
                    <Suspense fallback={<div className="prompt-chips-container"><p>Loading prompt suggestions...</p></div>}>
                        <SuggestedPrompts handleSend={handleSend} />
                    </Suspense>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                className={`message-wrapper ${msg.sender === "user" ? "user-msg" : "ai-msg"}`}
                            >
                                <Avatar 
                                    name={msg.sender === "user" ? "Me" : "Coach"} 
                                    size="sm" 
                                    style={{ background: msg.sender === "user" ? "var(--primary-light)" : "var(--success-light)" }}
                                />
                                <div className="message-bubble">
                                    <Suspense fallback={<span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>}>
                                        <Markdown content={msg.text} />
                                    </Suspense>
                                    <span className="msg-meta">{msg.timestamp}</span>
                                    
                                    {msg.sender === "ai" && !msg.isStreaming && (
                                        <div className="bubble-actions">
                                            <button 
                                                className="bubble-btn" 
                                                onClick={() => copyToClipboard(msg.text)}
                                                aria-label="Copy response to clipboard"
                                            >
                                                <FaCopy />
                                                <span>Copy</span>
                                            </button>
                                            <button 
                                                className="bubble-btn" 
                                                onClick={() => speakResponse(msg.text)}
                                                aria-label="Read response aloud"
                                            >
                                                <FaVolumeUp />
                                                <span>Listen</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message-wrapper ai-msg">
                                <Avatar name="Coach" size="sm" style={{ background: "var(--success-light)" }} />
                                <div className="message-bubble">
                                    <div className="typing-dots" aria-label="Coach is typing">
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Textarea Input area */}
            <div className="chat-input-bar">
                <textarea
                    className="chat-textarea"
                    placeholder="Message FitSage AI Coach..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button 
                    className="send-btn" 
                    onClick={() => handleSend()}
                    disabled={!message.trim() || loading}
                    aria-label="Send message to coach"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
}
