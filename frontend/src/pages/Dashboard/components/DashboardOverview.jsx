import React, { lazy, Suspense } from "react";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import Skeleton from "../../../components/ui/Skeleton";
import { FaChevronRight } from "react-icons/fa";

const InsightsCard = lazy(() => import("./InsightsCard"));

export default function DashboardOverview({
    latestWorkout,
    latestMeal,
    aiInsights,
    onNavigate
}) {
    return (
        <div className="dashboard-split">
            <div className="split-left">
                <div>
                    <h2 className="section-title">🏋 Today's Workout</h2>
                    {latestWorkout ? (
                        <Card clickable onClick={() => onNavigate("/workout")} bordered>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h4 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>
                                        Latest Generated Routine
                                    </h4>
                                    <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                                        Click to view exercises, reps, sets, and check them off.
                                    </p>
                                </div>
                                <FaChevronRight style={{ color: "var(--text-tertiary)" }} />
                            </div>
                        </Card>
                    ) : (
                        <EmptyState
                            icon="🏋"
                            title="No Workout Generated"
                            description="Generate a personalized workout plan matched to your target duration, equipment, and injuries."
                            actionLabel="Generate Plan Now"
                            onAction={() => onNavigate("/workout")}
                        />
                    )}
                </div>

                <div>
                    <h2 className="section-title">🍳 Today's Meals</h2>
                    {latestMeal ? (
                        <Card clickable onClick={() => onNavigate("/meal")} bordered>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h4 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>
                                        Latest Indian Meal Schedule
                                    </h4>
                                    <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                                        Review breakfast, lunch, dinner portions, and shopping items.
                                    </p>
                                </div>
                                <FaChevronRight style={{ color: "var(--text-tertiary)" }} />
                            </div>
                        </Card>
                    ) : (
                        <EmptyState
                            icon="🥦"
                            title="No Meal Plan Generated"
                            description="Design customized nutrition logs mapped to your budget constraints, allergies, and calories targets."
                            actionLabel="Plan Meals Now"
                            onAction={() => onNavigate("/meal")}
                        />
                    )}
                </div>
            </div>

            <div className="split-right">
                <div>
                    <h2 className="section-title">🧠 AI Insights</h2>
                    <Suspense fallback={<Skeleton variant="rect" height="100px" style={{ borderRadius: "var(--radius-xl)" }} />}>
                        <InsightsCard aiInsights={aiInsights} />
                    </Suspense>
                </div>

                <div>
                    <h2 className="section-title">🔔 Recent Activity</h2>
                    <Card bordered>
                        <div className="activity-feed">
                            <div className="activity-item">
                                <div className="activity-dot" />
                                <div className="activity-info">
                                    <span className="activity-title">Water intake updated</span>
                                    <span className="activity-time">Just now</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-dot" style={{ background: "var(--success)" }} />
                                <div className="activity-info">
                                    <span className="activity-title">Logged weights details</span>
                                    <span className="activity-time">Today</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-dot" style={{ background: "var(--warning)" }} />
                                <div className="activity-info">
                                    <span className="activity-title">Dashboard metrics synced</span>
                                    <span className="activity-time">Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
