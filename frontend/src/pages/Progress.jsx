import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";

// Custom Hook
import useProgress from "../hooks/useProgress";

// Feature Subcomponents
import ProgressLogForm from "./Progress/components/ProgressLogForm";
const ProgressAnalytics = lazy(() => import("./Progress/components/ProgressAnalytics"));

import { FaLock } from "react-icons/fa";

import "../styles/progress.css";

export default function Progress() {
    const navigate = useNavigate();
    const {
        loading,
        profileCompleted,
        history,
        profileHeight,
        logDate,
        setLogDate,
        logWeight,
        setLogWeight,
        logWater,
        setLogWater,
        logCalories,
        setLogCalories,
        workoutDone,
        setWorkoutDone,
        submitting,
        handleLogSubmit
    } = useProgress();

    if (loading) {
        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content" aria-busy="true" aria-label="Loading analytics">
                    <div className="progress-layout-grid animate-pulse">
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <Skeleton variant="title" width="200px" height="32px" />
                            <Skeleton variant="rect" height="300px" />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <Skeleton variant="rect" height="240px" />
                            <Skeleton variant="rect" height="240px" />
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
                            Progress analytics are locked. Set up your height, weight, safety guidelines, and fitness goals to access logs and graphs.
                        </p>
                        <Button onClick={() => navigate("/profile")}>
                            Go to Profile Setup
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    // Calculate dynamic BMI dataset for charts
    const heightM = profileHeight / 100;
    const formattedChartData = history.map((item) => {
        const itemWeight = parseFloat(item.weight) || 70;
        const itemBmi = parseFloat((itemWeight / (heightM * heightM)).toFixed(1));
        
        // Format date string to display short month days
        const formattedDate = new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric" });
        
        return {
            ...item,
            weight: itemWeight,
            water: item.water_intake || item.water || 0,
            calories: item.calories || 0,
            bmi: itemBmi,
            date: formattedDate
        };
    });

    return (
        <div className="layout">
            <Sidebar />

            <main className="main-content">
                <div className="progress-layout-grid animate-slide-in">
                    
                    <ProgressLogForm
                        handleLogSubmit={handleLogSubmit}
                        logDate={logDate}
                        setLogDate={setLogDate}
                        logWeight={logWeight}
                        setLogWeight={setLogWeight}
                        logWater={logWater}
                        setLogWater={setLogWater}
                        logCalories={logCalories}
                        setLogCalories={setLogCalories}
                        workoutDone={workoutDone}
                        setWorkoutDone={setWorkoutDone}
                        submitting={submitting}
                        history={history}
                    />

                    <Suspense fallback={<Skeleton variant="rect" height="400px" style={{ borderRadius: "var(--radius-xl)" }} />}>
                        <ProgressAnalytics chartData={formattedChartData} />
                    </Suspense>

                </div>
            </main>
        </div>
    );
}