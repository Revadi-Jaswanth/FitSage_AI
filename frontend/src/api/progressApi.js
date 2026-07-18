import API from "./api";

export const logProgress = (data) => API.post("/progress/log", data);
export const getProgressHistory = () => API.get("/progress/history");
export const addProgress = (data) => API.post("/progress/add", data);
