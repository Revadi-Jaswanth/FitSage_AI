import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Button from "../components/ui/Button";

// Custom Hook
import useCoach from "../hooks/useCoach";

// Feature Subcomponents
const ChatHistory = lazy(() => import("./Coach/components/ChatHistory"));
import CoachChat from "./Coach/components/CoachChat";

import { FaLock } from "react-icons/fa";

import "../styles/coach.css";

export default function Coach() {
    const navigate = useNavigate();
    const {
        message,
        setMessage,
        messages,
        loading,
        history,
        activeSessionId,
        setActiveSessionId,
        profileCompleted,
        pageLoading,
        messagesEndRef,
        handleSend,
        copyToClipboard,
        speakResponse,
        startNewChat,
        handleDeleteSession
    } = useCoach();

    if (pageLoading) {
        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content">
                    <h2>Checking coach access...</h2>
                </main>
            </div>
        );
    }

    if (!profileCompleted) {
        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content">
                    <div style={{
                        background: "var(--surface)",
                        borderRadius: "var(--radius-2xl)",
                        padding: "var(--space-xl)",
                        border: "1px solid var(--border-color)",
                        boxShadow: "var(--shadow-lg)",
                        maxWidth: "500px",
                        margin: "60px auto",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "var(--space-md)"
                    }}>
                        <div style={{ fontSize: "50px", color: "var(--primary-accent)" }}><FaLock /></div>
                        <h2 style={{ fontSize: "22px", fontWeight: 800 }}>Complete Profile to Unlock</h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
                            AI Fitness Coach is locked. Set up your height, weight, safety guidelines, and fitness goals to access the interactive chat coach.
                        </p>
                        <Button onClick={() => navigate("/profile")}>
                            Go to Profile Setup
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <h1>🤖 AI Fitness Coach</h1>
                    <p>Ask anything regarding training routines, nutritional planning, or recovery.</p>
                </div>

                <div className="coach-chat-container">
                    
                    <Suspense fallback={<aside className="chat-history-sidebar"><p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Loading history...</p></aside>}>
                        <ChatHistory
                            history={history}
                            activeSessionId={activeSessionId}
                            setActiveSessionId={setActiveSessionId}
                            startNewChat={startNewChat}
                            handleDeleteSession={handleDeleteSession}
                        />
                    </Suspense>

                    <CoachChat
                        messages={messages}
                        message={message}
                        setMessage={setMessage}
                        loading={loading}
                        handleSend={handleSend}
                        copyToClipboard={copyToClipboard}
                        speakResponse={speakResponse}
                        messagesEndRef={messagesEndRef}
                    />

                </div>
            </main>
        </div>
    );
}