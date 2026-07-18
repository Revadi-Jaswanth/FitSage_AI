import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";
import axios from "axios";
import {
  setTokens,
  getAccessToken,
  getRefreshToken,
  getUserEmail,
  clearTokens
} from "../api/authStorage";

const AuthContext = createContext(null);

let logoutCallback = null;

// Axios Request Interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Response Interceptor for Token Refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (excluding auth actions)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/register" &&
      originalRequest.url !== "/auth/refresh"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        if (logoutCallback) logoutCallback();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("http://127.0.0.1:5000/api/v1/auth/refresh", {
          refresh_token: refreshToken,
        });

        if (res.data.success) {
          const newAccessToken = res.data.data.access_token;
          setTokens(newAccessToken, refreshToken, getUserEmail());
          processQueue(null, newAccessToken);
          isRefreshing = false;

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        if (logoutCallback) logoutCallback();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAccessToken());
  const [userEmail, setUserEmail] = useState(getUserEmail());
  const [loading, setLoading] = useState(true);

  const login = (accessToken, refreshToken, email) => {
    setTokens(accessToken, refreshToken, email);
    setToken(accessToken);
    setUserEmail(email);
  };

  const logout = () => {
    clearTokens();
    setToken(null);
    setUserEmail(null);
  };

  useEffect(() => {
    logoutCallback = logout;
    
    const storedToken = getAccessToken();
    const storedEmail = getUserEmail();
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setUserEmail(storedEmail);
    } else {
      logout();
    }
    setLoading(false);
  }, []);

  const value = {
    token,
    userEmail,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
