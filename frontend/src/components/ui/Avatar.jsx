import React from "react";
import "./ui.css";

export default function Avatar({
    name = "",
    src,
    size = "md", // sm, md, lg
    className = "",
    ...props
}) {
    const initials = name
        ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "?";
        
    return (
        <div className={`avatar avatar-${size} ${className}`} {...props}>
            {src ? (
                <img src={src} alt={name} className="avatar-img" />
            ) : (
                <span className="avatar-initials">{initials}</span>
            )}
        </div>
    );
}
