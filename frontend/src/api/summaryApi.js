import API from "./api";

export const getSummary = () => API.get("/summary");
export const generateInsights = () => API.post("/summary/generate-insights");
