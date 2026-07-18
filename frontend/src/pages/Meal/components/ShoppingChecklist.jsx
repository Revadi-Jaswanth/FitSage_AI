import React from "react";
import Card from "../../../components/ui/Card";
import { FaShoppingCart, FaCheck } from "react-icons/fa";

export default function ShoppingChecklist({ shopping, boughtState, toggleBought }) {
    if (shopping.length === 0) return null;

    return (
        <div>
            <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "var(--space-md)", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaShoppingCart style={{ color: "var(--primary-accent)" }} />
                <span>Shopping Grocery List</span>
            </h2>
            <Card bordered>
                <div className="shopping-checklist">
                    {shopping.map((item, idx) => {
                        const isBought = !!boughtState[idx];
                        return (
                            <div 
                                key={idx}
                                className={`shopping-item ${isBought ? "bought" : ""}`}
                                onClick={() => toggleBought(idx)}
                                role="checkbox"
                                aria-checked={isBought}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        toggleBought(idx);
                                    }
                                }}
                            >
                                <div className="shopping-checkbox">
                                    {isBought && <FaCheck />}
                                </div>
                                <span>{item}</span>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
