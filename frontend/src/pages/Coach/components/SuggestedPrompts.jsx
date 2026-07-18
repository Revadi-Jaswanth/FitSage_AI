import React from "react";
import { FaBrain } from "react-icons/fa";

const SUGGESTED_PROMPTS = [
    "How can I lose weight safely with knee pain?",
    "Give me a quick 10-minute warm-up routine.",
    "What are some high-protein vegetarian snacks?",
    "How much water should I drink daily?"
];

export default function SuggestedPrompts({ handleSend }) {
    return (
        <div className="prompt-chips-container">
            <FaBrain style={{ fontSize: "48px", color: "var(--primary-accent)", margin: "0 auto var(--space-md) auto" }} />
            <h3 style={{ fontWeight: 800, fontSize: "18px", marginBottom: "var(--space-sm)" }}>
                Chat with your Coach
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "var(--space-xl)", lineHeight: 1.5 }}>
                Get insights on calorie targets, exercises alternatives, or motivational encouragement.
            </p>
            <div className="prompt-chips-grid">
                {SUGGESTED_PROMPTS.map((p, idx) => (
                    <button 
                        key={idx} 
                        className="chip-btn" 
                        onClick={() => handleSend(p)}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
}
