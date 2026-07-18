import React from "react";
import Sidebar from "../components/Sidebar";
import Button from "../components/ui/Button";

// Custom Hook
import useProfile from "../hooks/useProfile";

// Feature Subcomponents
import ProfileForms from "./Profile/components/ProfileForms";

import "../App.css";
import "../styles/profile.css";

export default function Profile() {
    const {
        profile,
        loading,
        saving,
        activeTab,
        setActiveTab,
        handleSelectValue,
        handleMultiSelect,
        handleChange,
        calculateLiveEstimates,
        calculateOnboardingProgress,
        saveProfile
    } = useProfile();

    if (loading || !profile) {
        return (
            <div className="layout">
                <Sidebar />
                <main className="main-content">
                    <h2>Loading profile details...</h2>
                </main>
            </div>
        );
    }

    const { bmi, bmr, calories } = calculateLiveEstimates();
    const completionPct = calculateOnboardingProgress();

    return (
        <div className="layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <h1>👤 My Profile</h1>
                    <p>Configure personal details, goals, and safety parameters below.</p>
                </div>

                <div className="profile-container">
                    
                    {/* Onboarding progress bar */}
                    <div className="onboarding-tracker">
                        <div className="tracker-meta">
                            <span>Profile Set Up Progress</span>
                            <span>{completionPct}% Complete</span>
                        </div>
                        <div className="tracker-bar-bg">
                            <div className="tracker-bar-fill" style={{ width: `${completionPct}%` }} />
                        </div>
                    </div>

                    {/* Section tabs navigation */}
                    <div className="profile-steps-nav">
                        <button 
                            className={`step-nav-btn ${activeTab === "metrics" ? "active" : ""}`}
                            onClick={() => setActiveTab("metrics")}
                        >
                            1. Personal Metrics
                        </button>
                        <button 
                            className={`step-nav-btn ${activeTab === "lifestyle" ? "active" : ""}`}
                            onClick={() => setActiveTab("lifestyle")}
                        >
                            2. Lifestyle & Goals
                        </button>
                        <button 
                            className={`step-nav-btn ${activeTab === "safety" ? "active" : ""}`}
                            onClick={() => setActiveTab("safety")}
                        >
                            3. Health & Safety
                        </button>
                    </div>

                    {/* Form area */}
                    <div className="card">
                        
                        <ProfileForms
                            activeTab={activeTab}
                            profile={profile}
                            handleChange={handleChange}
                            handleSelectValue={handleSelectValue}
                            handleMultiSelect={handleMultiSelect}
                            bmi={bmi}
                            bmr={bmr}
                            calories={calories}
                        />

                        {/* Navigation Actions buttons footer */}
                        <div className="profile-actions-footer">
                            <div>
                                {activeTab !== "metrics" && (
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => {
                                            if (activeTab === "lifestyle") setActiveTab("metrics");
                                            else if (activeTab === "safety") setActiveTab("lifestyle");
                                        }}
                                    >
                                        Previous Step
                                    </Button>
                                )}
                            </div>
                            
                            <div>
                                {activeTab !== "safety" ? (
                                    <Button 
                                        type="button"
                                        onClick={() => {
                                            if (activeTab === "metrics") setActiveTab("lifestyle");
                                            else if (activeTab === "lifestyle") setActiveTab("safety");
                                        }}
                                    >
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button 
                                        type="button" 
                                        onClick={saveProfile}
                                        isLoading={saving}
                                    >
                                        Save & Complete
                                    </Button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}