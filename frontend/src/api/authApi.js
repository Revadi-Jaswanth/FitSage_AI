import API from "./api";

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const refreshToken = (token) => API.post("/auth/refresh", { refresh_token: token });
