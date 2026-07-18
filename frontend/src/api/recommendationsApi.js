import API from "./api";

export const getRecommendations = () => API.get("/recommendations");
