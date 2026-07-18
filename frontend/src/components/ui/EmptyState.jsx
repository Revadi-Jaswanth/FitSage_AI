import React from "react";
import "./ui.css";
import Button from "./Button";

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    className = "",
    ...props
}) {
    return (
        <div className={`empty-state ${className}`} {...props}>
            {icon && <div className="empty-state-icon">{icon}</div>}
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} variant="outline" size="sm">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
