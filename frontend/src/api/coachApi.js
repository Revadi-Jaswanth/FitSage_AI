import API from "./api";

export const sendCoachMessage = (message, sessionId = "default") => 
    API.post("/coach/chat", { message, session_id: sessionId });

export const getCoachHistory = (sessionId = null) => 
    API.get("/coach/history", { params: sessionId ? { session_id: sessionId } : {} });

export const deleteCoachSession = (sessionId) => 
    API.delete(`/coach/session/${sessionId}`);
