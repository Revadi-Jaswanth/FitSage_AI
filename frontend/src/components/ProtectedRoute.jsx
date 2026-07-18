import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route protection guard.
 * If requireAuth is true (default): redirects unauthenticated users to the Login page ("/").
 * If requireAuth is false (guest/auth pages): redirects authenticated users to the Dashboard ("/dashboard").
 */
export default function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>Loading authentication...</h2>
      </div>
    );
  }

  if (requireAuth) {
    return isAuthenticated ? children : <Navigate to="/" replace />;
  } else {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
  }
}
