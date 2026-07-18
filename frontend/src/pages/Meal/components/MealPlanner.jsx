import React from "react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";

export default function MealPlanner({ meals }) {
    return (
        <div className="meal-timeline-grid">
            {meals.map((m, idx) => (
                <Card key={idx} bordered>
                    <div className="meal-card-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Badge variant="primary">{m.type}</Badge>
                            <span className="meal-title">{m.name}</span>
                        </div>
                        <div className="macro-badge-row">
                            <Badge variant="outline">{m.calories} kcal</Badge>
                            <Badge variant="success">{m.protein}g Protein</Badge>
                            <Badge variant="warning">{m.carbs}g Carbs</Badge>
                            <Badge variant="danger">{m.fat}g Fat</Badge>
                        </div>
                    </div>

                    <div className="meal-split-detail">
                        <div>
                            <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>
                                🛒 Ingredients
                            </p>
                            <ul style={{ paddingLeft: "16px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                {m.ingredients.map((ing, i) => (
                                    <li key={i}>{ing}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>
                                🍳 Preparation Details
                            </p>
                            <p className="prep-instructions">
                                {m.preparation}
                            </p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
