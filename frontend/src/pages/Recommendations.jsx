import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Sidebar from "../components/Sidebar";
import Button from "../components/ui/Button";
import { FaLock } from "react-icons/fa";
import "../App.css";

function Recommendations() {
    const navigate = useNavigate();
    const [recommendation, setRecommendation] = useState("Loading recommendations...");
    const [profileCompleted, setProfileCompleted] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRecommendations = async () => {
            try {
                setLoading(true);
                const response = await API.get("/recommendations");
                setRecommendation(response.data.data.recommendations);
                setProfileCompleted(true);
            } catch (error) {
                console.error("Failed to load recommendations:", error);
                if (error.response && error.response.status === 400) {
                    setProfileCompleted(false);
                } else {
                    setRecommendation("Unable to load recommendations.");
                }
            } finally {
                setLoading(false);
            }
        };

        getRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="layout">
                <Sidebar />
                <div className="main-content">
                    <div className="page-header">
                        <h1>🌟 Daily Recommendations</h1>
                        <p>Personalized AI suggestions for today.</p>
                    </div>
                    <div>Loading suggestions...</div>
                </div>
            </div>
        );
    }

    if (!profileCompleted) {
        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content">
                    <div style={{
                        background: "var(--surface)",
                        borderRadius: "var(--radius-2xl)",
                        padding: "var(--space-xl)",
                        border: "1px solid var(--border-color)",
                        boxShadow: "var(--shadow-lg)",
                        maxWidth: "500px",
                        margin: "60px auto",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "var(--space-md)"
                    }}>
                        <div style={{ fontSize: "50px", color: "var(--primary-accent)" }}><FaLock /></div>
                        <h2 style={{ fontSize: "22px", fontWeight: 800 }}>Complete Profile to Unlock</h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
                            AI suggestions are locked. Set up your height, weight, safety guidelines, and fitness goals to access daily recommendations.
                        </p>
                        <Button onClick={() => navigate("/profile")}>
                            Go to Profile Setup
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-header">
                    <h1>🌟 Daily Recommendations</h1>
                    <p>Personalized AI suggestions for today.</p>
                </div>
                <div className="card">
                    <div className="plan-text">
                        {recommendation}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recommendations;