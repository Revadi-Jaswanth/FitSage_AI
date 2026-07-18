import React from "react";
import { FaDumbbell, FaUtensils, FaBrain, FaWeight, FaPlus, FaChartLine } from "react-icons/fa";

export default function QuickActions({ onNavigate, onShowLog, onQuickLogWater }) {
    return (
        <div className="quick-actions-section">
            <h2 className="section-title">⚡ Quick Actions</h2>
            <div className="quick-actions-grid">
                <button className="action-btn" onClick={() => onNavigate("/workout")}>
                    <span className="action-icon" aria-hidden="true"><FaDumbbell /></span>
                    <span>Get Workout</span>
                </button>
                <button className="action-btn" onClick={() => onNavigate("/meal")}>
                    <span className="action-icon" aria-hidden="true"><FaUtensils /></span>
                    <span>Get Meal Plan</span>
                </button>
                <button className="action-btn" onClick={() => onNavigate("/coach")}>
                    <span className="action-icon" aria-hidden="true"><FaBrain /></span>
                    <span>Ask AI Coach</span>
                </button>
                <button className="action-btn" onClick={onShowLog}>
                    <span className="action-icon" aria-hidden="true"><FaWeight /></span>
                    <span>Log Weight</span>
                </button>
                <button className="action-btn" onClick={onQuickLogWater}>
                    <span className="action-icon" aria-hidden="true"><FaPlus /></span>
                    <span>+250ml Water</span>
                </button>
                <button className="action-btn" onClick={() => onNavigate("/progress")}>
                    <span className="action-icon" aria-hidden="true"><FaChartLine /></span>
                    <span>View Progress</span>
                </button>
            </div>
        </div>
    );
}
