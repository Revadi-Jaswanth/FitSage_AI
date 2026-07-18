import React from "react";
import "./ui.css";

export default function Button({
    children,
    variant = "primary", // primary, secondary, danger, outline, ghost, link
    size = "md", // sm, md, lg
    isLoading = false,
    className = "",
    disabled,
    ...props
}) {
    return (
        <button
            className={`btn btn-${variant} btn-${size} ${isLoading ? "btn-loading" : ""} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className="spinner" aria-hidden="true"></span> : children}
        </button>
    );
}
