import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";

// Custom Hook
import useWorkout from "../hooks/useWorkout";

// Feature Subcomponents
import WorkoutPlanner from "./Workout/components/WorkoutPlanner";

import { FaSyncAlt, FaLock } from "react-icons/fa";

import "../styles/workout.css";

export default function Workout() {
    const navigate = useNavigate();
    const {
        loading,
        profileCompleted,
        days,
        activeDayIdx,
        setActiveDayIdx,
        expandedExIdx,
        checkedState,
        fetchWorkout,
        toggleCheck,
        toggleExpand
    } = useWorkout();

    if (loading) {
        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content" aria-busy="true" aria-label="Loading workouts">
                    <div className="workout-container animate-pulse">
                        <div className="page-header">
                            <Skeleton variant="title" width="220px" height="32px" />
                            <Skeleton variant="text" width="300px" />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <Skeleton variant="rect" height="150px" />
                            <Skeleton variant="rect" height="150px" />
                            <Skeleton variant="rect" height="150px" />
                        </div>
                    </div>
                </main>
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
                            Workout plans are locked. Set up your height, weight, safety guidelines, and fitness goals to access personalized AI routines.
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

            <main className="main-content">
                <div className="workout-container animate-slide-in">
                    
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                        <div className="page-header" style={{ marginBottom: 0 }}>
                            <h1>💪 AI Workout Plan</h1>
                            <p>Interactive weekly calendar generated for your goals.</p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => fetchWorkout(true)}
                            aria-label="Regenerate workout plan"
                        >
                            <FaSyncAlt style={{ marginRight: "6px" }} />
                            Regenerate
                        </Button>
                    </div>

                    {days.length === 0 ? (
                        <EmptyState 
                            icon="🏋️"
                            title="No Workout Program Found"
                            description="Let's build a customized workout regimen mapping your availability, fitness level, and joint injuries."
                            actionLabel="Build Workout Now"
                            onAction={() => fetchWorkout(true)}
                        />
                    ) : (
                        <WorkoutPlanner
                            days={days}
                            activeDayIdx={activeDayIdx}
                            setActiveDayIdx={setActiveDayIdx}
                            checkedState={checkedState}
                            expandedExIdx={expandedExIdx}
                            toggleCheck={toggleCheck}
                            toggleExpand={toggleExpand}
                        />
                    )}

                </div>
            </main>
        </div>
    );
}