import React from "react";
import "./ui.css";

export default function LoadingSpinner({ size = "md", className = "", ...props }) {
    return (
        <div className={`spinner-container ${className}`} {...props}>
            <div className={`loading-spinner spinner-${size}`} />
        </div>
    );
}
