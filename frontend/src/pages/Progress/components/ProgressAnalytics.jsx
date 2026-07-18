import React from "react";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import { FaWeight, FaTint, FaUtensils } from "react-icons/fa";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export default function ProgressAnalytics({ chartData }) {
    if (chartData.length === 0) {
        return (
            <div className="charts-panel">
                <Card style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                    <EmptyState 
                        icon="📊"
                        title="No Analytics Available"
                        description="Log weight, calories, and water for a few days to visualize your fitness trend curves."
                    />
                </Card>
            </div>
        );
    }

    return (
        <div className="charts-panel">
            {/* Weight / BMI Curves */}
            <Card bordered>
                <div className="chart-card-header">
                    <h3 style={{ fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaWeight style={{ color: "var(--primary-accent)" }} />
                        <span>Weight & BMI Curve Trends</span>
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Visualizes weekly changes in body weight and body mass index.
                    </p>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} />
                            <YAxis stroke="var(--text-secondary)" fontSize={11} />
                            <Tooltip contentStyle={{ background: "var(--surface)", borderColor: "var(--border-color)", borderRadius: "8px" }} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="var(--primary-accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="bmi" name="BMI" stroke="var(--secondary-accent)" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Hydration Bar Chart */}
            <Card bordered>
                <div className="chart-card-header">
                    <h3 style={{ fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaTint style={{ color: "var(--secondary-accent)" }} />
                        <span>Daily Water Intake Logs</span>
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Shows daily water consumption details. Recommended limit: 3000ml.
                    </p>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} />
                            <YAxis stroke="var(--text-secondary)" fontSize={11} />
                            <Tooltip contentStyle={{ background: "var(--surface)", borderColor: "var(--border-color)", borderRadius: "8px" }} />
                            <Bar dataKey="water" name="Water (ml)" fill="var(--secondary-accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Calories Burned / Intake Bar Chart */}
            <Card bordered>
                <div className="chart-card-header">
                    <h3 style={{ fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaUtensils style={{ color: "#ef4444" }} />
                        <span>Calories Consumed Timeline</span>
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Shows daily calories input statistics. Recommended limit: 2000kcal.
                    </p>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} />
                            <YAxis stroke="var(--text-secondary)" fontSize={11} />
                            <Tooltip contentStyle={{ background: "var(--surface)", borderColor: "var(--border-color)", borderRadius: "8px" }} />
                            <Bar dataKey="calories" name="Calories (kcal)" fill="var(--primary-accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
