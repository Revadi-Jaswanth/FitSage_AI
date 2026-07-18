import React from "react";
import "./ui.css";

export default function Card({
    children,
    className = "",
    padding = "md", // none, sm, md, lg
    bordered = false,
    clickable = false,
    ...props
}) {
    return (
        <div
            className={`card card-p-${padding} ${bordered ? "card-bordered" : ""} ${clickable ? "card-clickable" : ""} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
