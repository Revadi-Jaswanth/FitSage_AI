import { useState, useEffect, useRef } from "react";
import { sendCoachMessage, getCoachHistory, deleteCoachSession } from "../api/coachApi";
import { getProfile } from "../api/profileApi";
import { useToast } from "../context/ToastContext";

const generateSessionId = () => "session_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();

export default function useCoach() {
    const { showToast } = useToast();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]); // List of chat sessions
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [profileCompleted, setProfileCompleted] = useState(true);
    const [pageLoading, setPageLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch the list of sessions (recent chats)
    const fetchSessions = async (shouldAutoSelect = false) => {
        try {
            const response = await getCoachHistory(); // No session_id param gets list of sessions
            const sessionsList = response.data.data;
            setHistory(sessionsList);
            
            if (shouldAutoSelect && sessionsList.length > 0) {
                // Auto-load the most recent session
                const mostRecent = sessionsList[0].session_id;
                setActiveSessionId(mostRecent);
                await fetchSessionMessages(mostRecent);
            } else if (shouldAutoSelect) {
                // Start a fresh session if none exists
                const newId = generateSessionId();
                setActiveSessionId(newId);
                setMessages([]);
            }
        } catch (error) {
            console.error("Failed to load chat sessions:", error);
        }
    };

    // Fetch messages for a specific session
    const fetchSessionMessages = async (sessionId) => {
        try {
            setLoading(true);
            const response = await getCoachHistory(sessionId);
            const parsed = [];
            response.data.data.forEach((chat) => {
                const timestamp = new Date(chat.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                parsed.push({ sender: "user", text: chat.user_message, timestamp });
                parsed.push({ sender: "ai", text: chat.ai_response, timestamp });
            });
            setMessages(parsed);
        } catch (error) {
            console.error("Failed to load session messages:", error);
            showToast("Failed to load messages for this conversation.", "danger");
        } finally {
            setLoading(false);
        }
    };

    // Load active session messages when session_id changes
    useEffect(() => {
        if (activeSessionId) {
            fetchSessionMessages(activeSessionId);
        }
    }, [activeSessionId]);

    // Initial load
    useEffect(() => {
        const initializeCoach = async () => {
            try {
                setPageLoading(true);
                const res = await getProfile();
                setProfileCompleted(res.data.data.profile_completed);
                if (res.data.data.profile_completed) {
                    await fetchSessions(true);
                }
            } catch (err) {
                console.error("Failed to check profile completion in coach:", err);
            } finally {
                setPageLoading(false);
            }
        };
        initializeCoach();
    }, []);

    // Keep scroll aligned
    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Create a brand new chat session
    const startNewChat = () => {
        const newId = generateSessionId();
        setActiveSessionId(newId);
        setMessages([]);
        setMessage("");
    };

    // Delete a chat session
    const handleDeleteSession = async (e, sessionId) => {
        e.stopPropagation(); // Avoid triggering select session
        try {
            await deleteCoachSession(sessionId);
            showToast("Conversation deleted.", "success");
            
            // Reload list of sessions
            const response = await getCoachHistory();
            const sessionsList = response.data.data;
            setHistory(sessionsList);

            if (activeSessionId === sessionId) {
                if (sessionsList.length > 0) {
                    setActiveSessionId(sessionsList[0].session_id);
                } else {
                    startNewChat();
                }
            }
        } catch (error) {
            console.error("Failed to delete chat session:", error);
            showToast("Failed to delete conversation.", "danger");
        }
    };

    const handleSend = async (customMsg = "") => {
        const textToSend = customMsg || message;
        if (!textToSend.trim()) return;

        if (!customMsg) {
            setMessage("");
        }

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [...prev, { sender: "user", text: textToSend, timestamp: now }]);
        setLoading(true);

        const currentSession = activeSessionId || generateSessionId();
        if (!activeSessionId) {
            setActiveSessionId(currentSession);
        }

        try {
            const response = await sendCoachMessage(textToSend, currentSession);
            const replyText = response.data.data.reply;

            setMessages((prev) => [...prev, { sender: "ai", text: "", isStreaming: true, timestamp: now }]);

            let currentText = "";
            let charIdx = 0;
            const interval = setInterval(() => {
                if (charIdx < replyText.length) {
                    currentText += replyText.slice(charIdx, charIdx + 4);
                    charIdx += 4;
                    setMessages((prev) => {
                        const copy = [...prev];
                        const last = copy[copy.length - 1];
                        if (last && last.isStreaming) {
                            last.text = currentText;
                        }
                        return copy;
                    });
                } else {
                    clearInterval(interval);
                    setMessages((prev) => {
                        const copy = [...prev];
                        const last = copy[copy.length - 1];
                        if (last) {
                            last.isStreaming = false;
                            last.text = replyText;
                        }
                        return copy;
                    });
                    
                    // Refresh sessions list to update the title of this session
                    fetchSessions(false);
                }
            }, 10);

        } catch (error) {
            console.error("Failed to communicate with AI coach:", error);
            const errReply = error.response?.data?.error || "Connection timed out. Please try again.";
            setMessages((prev) => [...prev, { sender: "ai", text: errReply, timestamp: now }]);
            showToast("Failed to receive coach response.", "danger");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showToast("Coach response copied to clipboard!", "success");
    };

    const speakResponse = (text) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/[#*_-]/g, "");
            const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300) + "...");
            window.speechSynthesis.speak(utterance);
            showToast("Playing voice assistance...", "info");
        } else {
            showToast("Text-to-speech is not supported on this browser.", "warning");
        }
    };

    return {
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
    };
}
