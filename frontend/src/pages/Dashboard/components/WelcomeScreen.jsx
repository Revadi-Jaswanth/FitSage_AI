import React from "react";
import Button from "../../../components/ui/Button";

export default function WelcomeScreen({ name, completionPct, onNavigate }) {
    return (
        <div className="welcome-onboarding-card">
            <div className="welcome-icon-large">👋</div>
            <h1 className="welcome-title-premium">Welcome to FitSage AI, {name}!</h1>
            <p className="welcome-desc-premium">
                Complete your personalized fitness profile to unlock tailored workout regimes, calorie estimations, water targets, and daily coaching insight metrics.
            </p>

            <div className="onboarding-tracker" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="tracker-meta">
                    <span>Setup Progress</span>
                    <span>{completionPct}% Done</span>
                </div>
                <div className="tracker-bar-bg">
                    <div className="tracker-bar-fill" style={{ width: `${completionPct}%` }} />
                </div>
            </div>

            <div className="welcome-steps-checklist">
                <div className="welcome-step-item">
                    <div className="welcome-step-num">1</div>
                    <span className="welcome-step-text">Provide Personal Metrics (Weight, Height, Age)</span>
                </div>
                <div className="welcome-step-item">
                    <div className="welcome-step-num">2</div>
                    <span className="welcome-step-text">Define Fitness Goals & Budgets</span>
                </div>
                <div className="welcome-step-item">
                    <div className="welcome-step-num">3</div>
                    <span className="welcome-step-text">Configure Injuries & Safety Preferences</span>
                </div>
            </div>

            <Button size="lg" onClick={onNavigate}>
                Complete Profile Setup
            </Button>
        </div>
    );
}
