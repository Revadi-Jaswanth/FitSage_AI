import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";

// Custom Hook
import useMeal from "../hooks/useMeal";

// Feature Subcomponents
import MealPlanner from "./Meal/components/MealPlanner";
const ShoppingChecklist = lazy(() => import("./Meal/components/ShoppingChecklist"));

import { FaSyncAlt, FaLock } from "react-icons/fa";

import "../App.css";

export default function Meal() {
    const navigate = useNavigate();
    const {
        loading,
        profileCompleted,
        meals,
        shopping,
        boughtState,
        fetchMeals,
        toggleBought
    } = useMeal();

    if (loading) {
        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content" aria-busy="true" aria-label="Loading meal plans">
                    <div className="meal-container animate-pulse">
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
                            Meal plans are locked. Set up your height, weight, safety guidelines, and fitness goals to access personalized AI nutrition guides.
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
                <div className="meal-container animate-slide-in">
                    
                    {/* Page Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                        <div className="page-header" style={{ marginBottom: 0 }}>
                            <h1>🥗 AI Meal Plan</h1>
                            <p>Personalized Indian menu plan mapping goals, budgets, and allergies.</p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => fetchMeals(true)}
                            aria-label="Regenerate meal plan"
                        >
                            <FaSyncAlt style={{ marginRight: "6px" }} />
                            Regenerate
                        </Button>
                    </div>

                    {meals.length === 0 ? (
                        <EmptyState 
                            icon="🥦"
                            title="No Meal Plan Generated"
                            description="Ready to plan? Build your custom Indian nutrition guide tailored to your macros, goals, and allergies."
                            actionLabel="Build Meal Plan"
                            onAction={() => fetchMeals(true)}
                        />
                    ) : (
                        <>
                            <MealPlanner meals={meals} />
                            <Suspense fallback={<Skeleton variant="rect" height="150px" style={{ borderRadius: "var(--radius-xl)" }} />}>
                                <ShoppingChecklist
                                    shopping={shopping}
                                    boughtState={boughtState}
                                    toggleBought={toggleBought}
                                />
                            </Suspense>
                        </>
                    )}

                </div>
            </main>
        </div>
    );
}