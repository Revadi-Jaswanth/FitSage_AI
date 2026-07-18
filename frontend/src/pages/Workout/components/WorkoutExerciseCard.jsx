import React from "react";
import { FaCheck, FaAngleUp, FaAngleDown } from "react-icons/fa";

export default function WorkoutExerciseCard({
    ex,
    index,
    activeDayIdx,
    isChecked,
    isExpanded,
    toggleExpand,
    toggleCheck
}) {
    return (
        <div className={`exercise-item ${isChecked ? "completed" : ""}`}>
            <div 
                className="exercise-header"
                onClick={() => toggleExpand(index)}
            >
                <div className="exercise-title-area">
                    <button 
                        className="exercise-checkbox" 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleCheck(activeDayIdx, index);
                        }}
                        aria-label={`Mark ${ex.name} as ${isChecked ? 'incomplete' : 'complete'}`}
                    >
                        {isChecked && <FaCheck />}
                    </button>
                    <div>
                        <span className="exercise-name">{ex.name}</span>
                        <div className="exercise-short-details">{ex.details}</div>
                    </div>
                </div>
                <div style={{ color: "var(--text-tertiary)" }}>
                    {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
                </div>
            </div>

            {isExpanded && (
                <div className="exercise-details-panel">
                    <p><strong>Instructions & Specifications:</strong></p>
                    <p style={{ lineHeight: 1.5 }}>
                        Ensure correct form. Move at a controlled tempo. Avoid locking joints at peak contraction.
                    </p>
                </div>
            )}
        </div>
    );
}
