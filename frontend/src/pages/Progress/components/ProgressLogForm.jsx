import React from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import Badge from "../../../components/ui/Badge";
import { FaChartLine } from "react-icons/fa";

export default function ProgressLogForm({
    handleLogSubmit,
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
    history
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
            <div className="page-header" style={{ marginBottom: 0 }}>
                <h1>📈 Progress Logs</h1>
                <p>Track weights, hydration levels, and check off workouts completed.</p>
            </div>

            {/* Submit Log Card */}
            <Card bordered>
                <form onSubmit={handleLogSubmit} className="log-form-card" aria-label="Log progress form">
                    <h3 style={{ fontSize: "16px", fontWeight: 800, borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaChartLine style={{ color: "var(--primary-accent)" }} />
                        <span>Log Daily Metrics</span>
                    </h3>

                    <Input 
                        label="Log Date"
                        type="date"
                        value={logDate}
                        onChange={(e) => setLogDate(e.target.value)}
                        required
                    />

                    <div className="log-form-grid">
                        <Input 
                            label="Weight (kg)"
                            type="number"
                            step="0.1"
                            placeholder="e.g. 74.5"
                            value={logWeight}
                            onChange={(e) => setLogWeight(e.target.value)}
                            required
                        />
                        <Input 
                            label="Water (ml)"
                            type="number"
                            step="50"
                            placeholder="e.g. 2500"
                            value={logWater}
                            onChange={(e) => setLogWater(e.target.value)}
                            required
                        />
                    </div>

                    <Input 
                        label="Calories Consumed (kcal)"
                        type="number"
                        step="10"
                        placeholder="e.g. 1850"
                        value={logCalories}
                        onChange={(e) => setLogCalories(e.target.value)}
                        required
                    />

                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 600, padding: "8px 0" }}>
                        <input 
                            type="checkbox" 
                            checked={workoutDone} 
                            onChange={(e) => setWorkoutDone(e.target.checked)}
                            style={{ width: "18px", height: "18px", accentColor: "var(--primary-accent)" }}
                        />
                        <span>Did you complete a workout today?</span>
                    </label>

                    <Button type="submit" isLoading={submitting} size="lg" style={{ marginTop: "10px" }}>
                        Save Progress Log
                    </Button>
                </form>
            </Card>

            {/* History Log Table */}
            <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "var(--space-md)" }}>
                    Log History list
                </h3>
                {history.length === 0 ? (
                    <EmptyState 
                        icon="📈"
                        title="No History Logs Found"
                        description="Start submitting daily progress stats using the logger form above."
                    />
                ) : (
                    <div className="history-table-wrapper">
                        <table className="progress-history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Weight</th>
                                    <th>Water</th>
                                    <th>Workout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</td>
                                        <td>{item.weight || item.current_weight} kg</td>
                                        <td>{item.water_intake || item.water} ml</td>
                                        <td>
                                            {item.workout_completed ? (
                                                <Badge variant="success">Completed</Badge>
                                            ) : (
                                                <Badge variant="secondary">Rest Day</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
