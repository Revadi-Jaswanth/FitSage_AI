import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

/**
 * Login component representing the user login page.
 * Uses AuthContext to save JWT credentials and navigate users upon successful authentication.
 */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login: saveAuthContext } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({
        email,
        password
      });

      if (response.data.success) {
        const { access_token, refresh_token, email: userEmail } = response.data.data;
        saveAuthContext(access_token, refresh_token, userEmail);
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).join(", ");
        setError(validationErrors || error.response.data.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "100px auto", background: "white", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
      <h1 style={{ color: "#1b4332", marginBottom: "20px", textAlign: "center" }}>FitSage Login</h1>
      {error && (
        <div style={{ color: "#d9534f", background: "#fdf7f7", padding: "12px", borderRadius: "8px", border: "1px solid #eed3d7", marginBottom: "20px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "15px" }}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "15px" }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: "100%", padding: "12px", background: "#1b4332", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#666" }}>
        New to FitSage? <Link to="/register" style={{ color: "#2d6a4f", fontWeight: "bold", textDecoration: "none" }}>Register here</Link>
      </p>
    </div>
  );
}

export default Login;