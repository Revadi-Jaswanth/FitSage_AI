import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

/**
 * Register component representing the user registration page.
 * Handles client-side validation, API communication with endpoints, and redirects.
 */
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser({
        name,
        email,
        password
      });

      if (res.data.success) {
        alert("Registration successful! Please log in.");
        navigate("/");
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = Object.values(err.response.data.errors).join(", ");
        setError(validationErrors || err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "100px auto", background: "white", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
      <h1 style={{ color: "#1b4332", marginBottom: "20px", textAlign: "center" }}>FitSage Register</h1>
      {error && (
        <div style={{ color: "#d9534f", background: "#fdf7f7", padding: "12px", borderRadius: "8px", border: "1px solid #eed3d7", marginBottom: "20px", fontSize: "14px" }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "15px" }}
        />
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      
      <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#666" }}>
        Already have an account? <Link to="/" style={{ color: "#2d6a4f", fontWeight: "bold", textDecoration: "none" }}>Login here</Link>
      </p>
    </div>
  );
}
