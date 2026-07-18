import API from "./api";

export const generateMeal = (force = false) => 
  API.get(`/meal/generate${force ? "?force=true" : ""}`);
