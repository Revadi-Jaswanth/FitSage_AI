import React from "react";
import "./ui.css";

export default function Input({
    label,
    error,
    className = "",
    id,
    ...props
}) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    return (
        <div className={`form-control ${className}`}>
            {label && <label htmlFor={inputId} className="form-label">{label}</label>}
            <input
                id={inputId}
                className={`form-input ${error ? "form-input-error" : ""}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
                {...props}
            />
            {error && <span id={`${inputId}-error`} className="form-error">{error}</span>}
        </div>
    );
}
