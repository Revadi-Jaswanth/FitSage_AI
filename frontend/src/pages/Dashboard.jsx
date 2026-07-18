import React, { useState, lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import QuickLog from "../components/QuickLog";
import Skeleton from "../components/ui/Skeleton";

// Custom Hooks
import useDashboard from "../hooks/useDashboard";

// Feature Subcomponents
import WelcomeScreen from "./Dashboard/components/WelcomeScreen";
import SetupLoader from "./Dashboard/components/SetupLoader";
import DashboardHero from "./Dashboard/components/DashboardHero";
import DashboardStats from "./Dashboard/components/DashboardStats";
import QuickActions from "./Dashboard/components/QuickActions";

const DashboardOverview = lazy(() => import("./Dashboard/components/DashboardOverview"));

import "../styles/dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const [showLog, setShowLog] = useState(false);

    const {
        loading,
        data,
        profileData,
        chartData,
        taskStatus,
        setupError,
        latestProgress,
        fetchDashboard,
        triggerParallelSetup,
        triggerSingleTask,
        quickLogWater
    } = useDashboard();

    useEffect(() => {
        if (!loading && data?.initial_setup_completed) {
            const prefetchPages = () => {
                import("./Workout");
                import("./Meal");
                import("./Progress");
            };
            if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                window.requestIdleCallback(prefetchPages);
            } else {
                setTimeout(prefetchPages, 2000);
            }
        }
    }, [loading, data]);

    if (loading || !data) {
        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content" aria-busy="true" aria-label="Loading dashboard">
                    <div className="dashboard-layout animate-pulse">
                        <div className="page-header">
                            <Skeleton variant="title" width="220px" height="32px" />
                            <Skeleton variant="text" width="300px" />
                        </div>
                        <Skeleton variant="rect" height="160px" style={{ borderRadius: "var(--radius-2xl)" }} />
                        <div className="dashboard-grid">
                            <Skeleton variant="rect" height="120px" />
                            <Skeleton variant="rect" height="120px" />
                            <Skeleton variant="rect" height="120px" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // 1. FIRST-TIME WELCOME ONBOARDING STATE
    if (data.profile_completed === false) {
        const completionPct = (() => {
            if (!profileData) return 0;
            const requiredFields = [
                profileData.age, profileData.gender, profileData.height, profileData.weight, 
                profileData.goal, profileData.diet, profileData.budget, profileData.activity, 
                profileData.equipment, profileData.fitness_level, profileData.workout_duration, 
                profileData.workout_location, profileData.water_goal, profileData.sleep_hours
            ];
            const completed = requiredFields.filter(val => val !== null && String(val).trim() !== "").length;
            return Math.round((completed / requiredFields.length) * 100);
        })();

        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content">
                    <WelcomeScreen
                        name={data.profile.name}
                        completionPct={completionPct}
                        onNavigate={() => navigate("/profile")}
                    />
                </main>
            </div>
        );
    }

    // 2. PARALLEL SETUP AI GENERATION SCREEN
    if (data.profile_completed === true && data.initial_setup_completed === false) {
        const anyRunning = Object.values(taskStatus).some(s => s === "running");
        const anyFailed = Object.values(taskStatus).some(s => s === "failed");
        const allPending = Object.values(taskStatus).every(s => s === "pending");

        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content">
                    <SetupLoader
                        taskStatus={taskStatus}
                        setupError={setupError}
                        allPending={allPending}
                        anyRunning={anyRunning}
                        anyFailed={anyFailed}
                        triggerParallelSetup={triggerParallelSetup}
                        triggerSingleTask={triggerSingleTask}
                    />
                </main>
            </div>
        );
    }

    // 3. MAIN DASHBOARD STATE (INITIAL SETUP IS COMPLETE)
    const currentWeight = data.dashboard.current_weight || 70;
    const caloriesTarget = data.calories_target || 2000;
    const streak = data.current_streak || 0;

    // Water tracking
    const todayWater = latestProgress?.water || 0;
    const waterPct = Math.round((todayWater / 3000) * 100) || 0;

    // Calories tracker
    const todayCalories = latestProgress?.calories || 0;
    const caloriesPct = Math.round((todayCalories / caloriesTarget) * 100) || 0;

    // Completion overall
    const overallCompletion = Math.round((Math.min(100, waterPct) + Math.min(100, caloriesPct)) / 2) || 0;

    const bmi = data.bmr ? ((currentWeight / (((data.profile?.height || 170) / 100) ** 2))).toFixed(1) : "--";

    return (
        <div className="layout">
            <Sidebar />
            
            <main className="main-content">
                <div className="dashboard-layout animate-slide-in">
                    
                    <DashboardHero
                        name={data.profile.name}
                        goal={data.profile.goal}
                        streak={streak}
                        overallCompletion={overallCompletion}
                    />

                    <DashboardStats
                        currentWeight={currentWeight}
                        bmi={bmi}
                        todayCalories={todayCalories}
                        caloriesPct={caloriesPct}
                        caloriesTarget={caloriesTarget}
                        todayWater={todayWater}
                        waterPct={waterPct}
                        workoutsCompleted={data.dashboard.workouts_completed}
                        onNavigate={navigate}
                    />

                    <QuickActions
                        onNavigate={navigate}
                        onShowLog={() => setShowLog(true)}
                        onQuickLogWater={quickLogWater}
                    />

                    <Suspense fallback={<Skeleton variant="rect" height="300px" style={{ borderRadius: "var(--radius-xl)" }} />}>
                        <DashboardOverview
                            latestWorkout={data.latest_workout}
                            latestMeal={data.latest_meal}
                            aiInsights={data.ai_insights}
                            onNavigate={navigate}
                        />
                    </Suspense>

                </div>
            </main>

            {showLog && (
                <QuickLog
                    closeModal={() => setShowLog(false)}
                    refreshDashboard={fetchDashboard}
                />
            )}
        </div>
    );
}