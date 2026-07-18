import React from "react";
import "./ui.css";

export default function Select({
    label,
    error,
    options = [],
    className = "",
    id,
    ...props
}) {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    return (
        <div className={`form-control ${className}`}>
            {label && <label htmlFor={selectId} className="form-label">{label}</label>}
            <select
                id={selectId}
                className={`form-select ${error ? "form-input-error" : ""}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${selectId}-error` : undefined}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span id={`${selectId}-error`} className="form-error">{error}</span>}
        </div>
    );
}
