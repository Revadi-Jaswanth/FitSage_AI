import API from "./api";

export const generateWorkout = (force = false) => 
  API.get(`/workout/generate${force ? "?force=true" : ""}`);
