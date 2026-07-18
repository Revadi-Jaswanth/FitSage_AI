import React from "react";
import "./ui.css";

export default function ProgressRing({
    radius = 40,
    stroke = 6,
    progress = 0, // 0 to 100
    color = "var(--primary-accent)",
    bgColor = "var(--border-color)",
    className = "",
    ...props
}) {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

    return (
        <svg
            height={radius * 2}
            width={radius * 2}
            className={`progress-ring ${className}`}
            {...props}
        >
            <circle
                stroke={bgColor}
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeLinecap="round"
            />
        </svg>
    );
}
