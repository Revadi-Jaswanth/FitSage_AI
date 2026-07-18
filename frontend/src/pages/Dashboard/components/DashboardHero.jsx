import React from "react";
import { FaTrophy } from "react-icons/fa";
import ProgressRing from "../../../components/ui/ProgressRing";

export default function DashboardHero({ name, goal, streak, overallCompletion }) {
    return (
        <div className="dashboard-hero">
            <div className="hero-main">
                <h1>Welcome back, {name}! 👋</h1>
                <p>
                    You are working towards: <strong>{goal || "Staying healthy"}</strong>. 
                    Keep consistency high to hit your targets today.
                </p>
                <div className="hero-meta">
                    <span className="streak-badge">
                        <FaTrophy style={{ color: "#fbbf24" }} />
                        <span>{streak} Day Streak!</span>
                    </span>
                </div>
            </div>
            <div className="hero-progress-ring">
                <ProgressRing progress={overallCompletion} radius={50} stroke={6} color="#ffffff" bgColor="rgba(255,255,255,0.2)" />
                <span>{overallCompletion}% Done Today</span>
            </div>
        </div>
    );
}
