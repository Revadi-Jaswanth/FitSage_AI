import React, { lazy, Suspense } from "react";
import Badge from "../../../components/ui/Badge";
import Skeleton from "../../../components/ui/Skeleton";
import { FaCalendarAlt, FaClock, FaFire } from "react-icons/fa";

const WorkoutExerciseCard = lazy(() => import("./WorkoutExerciseCard"));

export default function WorkoutPlanner({
    days,
    activeDayIdx,
    setActiveDayIdx,
    checkedState,
    expandedExIdx,
    toggleCheck,
    toggleExpand
}) {
    const currentDay = days[activeDayIdx];

    return (
        <>
            {/* Calendar Days Tabs */}
            <div className="weekly-tabs" role="tablist">
                {days.map((d, index) => (
                    <button
                        key={index}
                        role="tab"
                        aria-selected={activeDayIdx === index}
                        className={`tab-btn ${activeDayIdx === index ? "active" : ""}`}
                        onClick={() => {
                            setActiveDayIdx(index);
                            toggleExpand(null); // Reset expansion on day switch
                        }}
                    >
                        <FaCalendarAlt style={{ marginRight: "6px" }} />
                        Day {d.day}
                    </button>
                ))}
            </div>

            {/* Active Day Card */}
            {currentDay && (
                <div role="tabpanel">
                    <div className="day-header-card">
                        <div>
                            <Badge variant="primary" style={{ marginBottom: "8px" }}>
                                {currentDay.difficulty}
                            </Badge>
                            <h2 style={{ fontSize: "20px", fontWeight: 800 }}>
                                {currentDay.title}
                            </h2>
                            <div className="day-meta">
                                <span className="meta-pill"><FaClock /> {currentDay.duration} mins</span>
                                <span className="meta-pill"><FaFire /> {currentDay.calories} kcal</span>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>
                                Focus Areas
                            </p>
                            <div style={{ display: "flex", gap: "5px", marginTop: "4px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                                {currentDay.muscles.map((m, i) => (
                                    <Badge key={i} variant="outline">{m}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Exercises List */}
                    <div className="exercise-list">
                        <Suspense fallback={<Skeleton variant="rect" height="80px" style={{ borderRadius: "var(--radius-lg)" }} />}>
                            {currentDay.exercises.map((ex, index) => {
                                const isChecked = !!checkedState[`${activeDayIdx}-${index}`];
                                const isExpanded = expandedExIdx === index;
                                
                                return (
                                    <WorkoutExerciseCard
                                        key={index}
                                        ex={ex}
                                        index={index}
                                        activeDayIdx={activeDayIdx}
                                        isChecked={isChecked}
                                        isExpanded={isExpanded}
                                        toggleExpand={toggleExpand}
                                        toggleCheck={toggleCheck}
                                    />
                                );
                            })}
                        </Suspense>
                    </div>
                </div>
            )}
        </>
    );
}
