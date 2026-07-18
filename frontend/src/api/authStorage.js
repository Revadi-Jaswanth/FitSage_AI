/**
 * Storage helper abstraction for authentication tokens.
 * Abstracts local storage mechanisms to allow easy transition to HTTP-only cookies in the future.
 */

export const setTokens = (accessToken, refreshToken, email) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
  localStorage.setItem("email", email);
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

export const getUserEmail = () => {
  return localStorage.getItem("email");
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("email");
};
