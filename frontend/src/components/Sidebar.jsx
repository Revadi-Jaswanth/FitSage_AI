import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon, FaBars, FaTimes, FaSignOutAlt, FaUser, FaDumbbell, FaUtensils, FaChartLine, FaBrain, FaCompass } from "react-icons/fa";
import "./../styles/sidebar.css";

export default function Sidebar() {
    const location = useLocation();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const menu = [
        { name: "Dashboard", path: "/dashboard", icon: <FaChartLine /> },
        { name: "Profile", path: "/profile", icon: <FaUser /> },
        { name: "Workout", path: "/workout", icon: <FaDumbbell /> },
        { name: "Meal Plan", path: "/meal", icon: <FaUtensils /> },
        { name: "Progress", path: "/progress", icon: <FaChartLine /> },
        { name: "AI Coach", path: "/coach", icon: <FaBrain /> },
        { name: "Recommendations", path: "/recommendations", icon: <FaCompass /> }
    ];

    return (
        <>
            {/* Mobile Hamburger Header */}
            <header className="mobile-header">
                <button 
                    className="hamburger-btn" 
                    onClick={() => setIsOpen(true)} 
                    aria-label="Open navigation menu"
                >
                    <FaBars />
                </button>
                <span className="mobile-logo">FitSage AI</span>
                <button 
                    className="theme-toggle-btn" 
                    onClick={toggleTheme} 
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === "dark" ? <FaSun /> : <FaMoon />}
                </button>
            </header>

            {/* Backdrop overlay */}
            {isOpen && (
                <div 
                    className="sidebar-backdrop" 
                    onClick={() => setIsOpen(false)} 
                    aria-hidden="true"
                />
            )}

            {/* Sidebar drawer */}
            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`} role="navigation">
                <div className="sidebar-header">
                    <h2 className="logo">FitSage AI</h2>
                    <button 
                        className="close-btn" 
                        onClick={() => setIsOpen(false)} 
                        aria-label="Close navigation menu"
                    >
                        <FaTimes />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menu.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`menu-link ${location.pathname === item.path ? "active" : ""}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="menu-icon">{item.icon}</span>
                            <span className="menu-text">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button 
                        className="theme-toggle-desktop" 
                        onClick={toggleTheme} 
                        aria-label={`Toggle theme: current is ${theme}`}
                    >
                        {theme === "dark" ? (
                            <>
                                <FaSun aria-hidden="true" />
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <FaMoon aria-hidden="true" />
                                <span>Dark Mode</span>
                            </>
                        )}
                    </button>

                    <button
                        className="logout-btn"
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        <FaSignOutAlt aria-hidden="true" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}