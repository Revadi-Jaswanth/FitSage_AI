import React from "react";

export default function EstimatesPanel({ bmi, bmr, calories }) {
    return (
        <div className="estimations-preview-panel">
            <div className="estimation-item">
                <span className="estimation-label">Dynamic BMI</span>
                <span className="estimation-value">{bmi}</span>
            </div>
            <div className="estimation-item">
                <span className="estimation-label">Calculated BMR</span>
                <span className="estimation-value">{bmr} <span style={{fontSize: '11px'}}>kcal</span></span>
            </div>
            <div className="estimation-item">
                <span className="estimation-label">Calorie Requirement</span>
                <span className="estimation-value">{calories} <span style={{fontSize: '11px'}}>kcal</span></span>
            </div>
        </div>
    );
}
