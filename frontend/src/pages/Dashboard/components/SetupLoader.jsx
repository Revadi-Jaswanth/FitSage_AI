import React from "react";
import Button from "../../../components/ui/Button";

export default function SetupLoader({
    taskStatus,
    setupError,
    allPending,
    anyRunning,
    anyFailed,
    triggerParallelSetup,
    triggerSingleTask
}) {
    return (
        <div className="setup-generation-panel">
            <div className="setup-generation-header">
                <h2>Crafting Your AI Plans</h2>
                <p>We are configuring your workouts, meal lists, and safety suggestions in parallel.</p>
            </div>

            <div className="setup-tasks-list">
                <div className="setup-task-row">
                    <div className="setup-task-info">
                        <span className="setup-task-icon">🏋️</span>
                        <span className="setup-task-name">AI Workout Schedule</span>
                    </div>
                    <div>
                        {taskStatus.workout === "failed" && (
                            <button className="task-retry-btn" onClick={() => triggerSingleTask("workout")}>Retry</button>
                        )}
                        <span className={`setup-task-status-badge setup-status-${taskStatus.workout}`}>
                            {taskStatus.workout.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="setup-task-row">
                    <div className="setup-task-info">
                        <span className="setup-task-icon">🥦</span>
                        <span className="setup-task-name">AI Diet & Meal Planner</span>
                    </div>
                    <div>
                        {taskStatus.meal === "failed" && (
                            <button className="task-retry-btn" onClick={() => triggerSingleTask("meal")}>Retry</button>
                        )}
                        <span className={`setup-task-status-badge setup-status-${taskStatus.meal}`}>
                            {taskStatus.meal.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="setup-task-row">
                    <div className="setup-task-info">
                        <span className="setup-task-icon">💡</span>
                        <span className="setup-task-name">Personalized Recommendations</span>
                    </div>
                    <div>
                        {taskStatus.recommendations === "failed" && (
                            <button className="task-retry-btn" onClick={() => triggerSingleTask("recommendations")}>Retry</button>
                        )}
                        <span className={`setup-task-status-badge setup-status-${taskStatus.recommendations}`}>
                            {taskStatus.recommendations.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="setup-task-row">
                    <div className="setup-task-info">
                        <span className="setup-task-icon">🧠</span>
                        <span className="setup-task-name">AI Health Insights</span>
                    </div>
                    <div>
                        {taskStatus.insights === "failed" && (
                            <button className="task-retry-btn" onClick={() => triggerSingleTask("insights")}>Retry</button>
                        )}
                        <span className={`setup-task-status-badge setup-status-${taskStatus.insights}`}>
                            {taskStatus.insights.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {setupError && (
                <div style={{ color: "var(--danger)", textAlign: "center", fontSize: "14px" }}>
                    {setupError}
                </div>
            )}

            <div style={{ textAlign: "center" }}>
                {allPending && (
                    <Button size="lg" onClick={triggerParallelSetup}>
                        Generate My Custom Plans
                    </Button>
                )}
                {anyRunning && (
                    <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                        Please hold on while Gemini builds your fitness metrics...
                    </div>
                )}
                {anyFailed && !anyRunning && (
                    <Button onClick={triggerParallelSetup}>
                        Retry Failed Generations
                    </Button>
                )}
            </div>
        </div>
    );
}
