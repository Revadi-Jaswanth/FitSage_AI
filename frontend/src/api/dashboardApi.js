import API from "./api";

export const getStats = () => API.get("/dashboard/stats");
