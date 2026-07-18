import React from "react";
import Skeleton from "./Skeleton";
import "../../styles/dashboard.css"; // Ensure standard dashboard classes are loaded

export default function AppSkeleton() {
    return (
        <div className="layout">
            {/* Sidebar Skeleton */}
            <aside 
                className="sidebar" 
                style={{ 
                    width: "260px", 
                    minHeight: "100vh", 
                    padding: "var(--space-lg)", 
                    borderRight: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-xl)"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Skeleton variant="avatar" width="40px" height="40px" />
                    <Skeleton variant="title" width="120px" height="24px" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                    <Skeleton variant="rect" height="40px" style={{ borderRadius: "var(--radius-md)" }} />
                    <Skeleton variant="rect" height="40px" style={{ borderRadius: "var(--radius-md)" }} />
                    <Skeleton variant="rect" height="40px" style={{ borderRadius: "var(--radius-md)" }} />
                    <Skeleton variant="rect" height="40px" style={{ borderRadius: "var(--radius-md)" }} />
                    <Skeleton variant="rect" height="40px" style={{ borderRadius: "var(--radius-md)" }} />
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <main className="main-content" style={{ padding: "var(--space-xl)" }}>
                <div className="page-header" style={{ marginBottom: "var(--space-xl)" }}>
                    <Skeleton variant="title" width="220px" height="32px" />
                    <Skeleton variant="text" width="340px" style={{ marginTop: "8px" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                    {/* Hero area skeleton */}
                    <Skeleton 
                        variant="rect" 
                        height="140px" 
                        style={{ borderRadius: "var(--radius-2xl)", width: "100%" }} 
                    />

                    {/* Grid cards skeletons */}
                    <div className="dashboard-grid">
                        <Skeleton variant="rect" height="120px" style={{ borderRadius: "var(--radius-xl)" }} />
                        <Skeleton variant="rect" height="120px" style={{ borderRadius: "var(--radius-xl)" }} />
                        <Skeleton variant="rect" height="120px" style={{ borderRadius: "var(--radius-xl)" }} />
                    </div>

                    {/* Main content body rows skeletons */}
                    <div style={{ display: "flex", gap: "var(--space-lg)", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Skeleton variant="rect" height="180px" style={{ borderRadius: "var(--radius-xl)" }} />
                            <Skeleton variant="rect" height="180px" style={{ borderRadius: "var(--radius-xl)" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Skeleton variant="rect" height="280px" style={{ borderRadius: "var(--radius-xl)" }} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
