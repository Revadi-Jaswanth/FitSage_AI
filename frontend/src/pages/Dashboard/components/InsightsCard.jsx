import React from "react";
import Card from "../../../components/ui/Card";

export default function InsightsCard({ aiInsights }) {
    return (
        <Card className="ai-insight-card">
            <p className="insight-text">
                "{aiInsights || "Focus on progressive consistency in your workouts today. Small, structured changes yield cumulative fitness results over time."}"
            </p>
        </Card>
    );
}
