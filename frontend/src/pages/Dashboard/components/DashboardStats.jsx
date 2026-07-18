import React from "react";
import Card from "../../../components/ui/Card";
import { FaWeight, FaHeartbeat, FaFire, FaWater, FaDumbbell, FaBrain } from "react-icons/fa";

export default function DashboardStats({
    currentWeight,
    bmi,
    todayCalories,
    caloriesPct,
    caloriesTarget,
    todayWater,
    waterPct,
    workoutsCompleted,
    onNavigate
}) {
    return (
        <div className="dashboard-grid">
            <Card clickable onClick={() => onNavigate("/progress")}>
                <div className="stat-card-content">
                    <div className="stat-icon"><FaWeight /></div>
                    <div className="stat-info">
                        <span className="stat-label">Weight</span>
                        <div className="stat-value-container">
                            <span className="stat-value">{currentWeight}</span>
                            <span className="stat-unit">kg</span>
                        </div>
                        <span className="stat-trend trend-flat">Current Value</span>
                    </div>
                </div>
            </Card>

            <Card clickable onClick={() => onNavigate("/progress")}>
                <div className="stat-card-content">
                    <div className="stat-icon"><FaHeartbeat /></div>
                    <div className="stat-info">
                        <span className="stat-label">BMI Score</span>
                        <div className="stat-value-container">
                            <span className="stat-value">{bmi}</span>
                            <span className="stat-unit">kg/m²</span>
                        </div>
                        <span className={`stat-trend ${bmi >= 18.5 && bmi < 25 ? "trend-up" : "trend-down"}`}>
                            {bmi >= 18.5 && bmi < 25 ? "Healthy Range" : "Needs Attention"}
                        </span>
                    </div>
                </div>
            </Card>

            <Card clickable onClick={() => onNavigate("/progress")}>
                <div className="stat-card-content">
                    <div className="stat-icon"><FaFire /></div>
                    <div className="stat-info">
                        <span className="stat-label">Calories</span>
                        <div className="stat-value-container">
                            <span className="stat-value">{todayCalories}</span>
                            <span className="stat-unit">kcal</span>
                        </div>
                        <span className="stat-trend trend-flat">{caloriesPct}% of {caloriesTarget} target</span>
                    </div>
                </div>
            </Card>

            <Card clickable onClick={() => onNavigate("/progress")}>
                <div className="stat-card-content">
                    <div className="stat-icon"><FaWater /></div>
                    <div className="stat-info">
                        <span className="stat-label">Water Intake</span>
                        <div className="stat-value-container">
                            <span className="stat-value">{todayWater}</span>
                            <span className="stat-unit">ml</span>
                        </div>
                        <span className="stat-trend trend-flat">{waterPct}% of 3L target</span>
                    </div>
                </div>
            </Card>

            <Card clickable onClick={() => onNavigate("/workout")}>
                <div className="stat-card-content">
                    <div className="stat-icon"><FaDumbbell /></div>
                    <div className="stat-info">
                        <span className="stat-label">Workouts</span>
                        <div className="stat-value-container">
                            <span className="stat-value">{workoutsCompleted}</span>
                            <span className="stat-unit">done</span>
                        </div>
                        <span className="stat-trend trend-up">All-time count</span>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="stat-card-content">
                    <div className="stat-icon"><FaBrain /></div>
                    <div className="stat-info">
                        <span className="stat-label">Readiness</span>
                        <div className="stat-value-container">
                            <span className="stat-value">92</span>
                            <span className="stat-unit">%</span>
                        </div>
                        <span className="stat-trend trend-up">Optimal state</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
