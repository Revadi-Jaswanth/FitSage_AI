import React from "react";
import EstimatesPanel from "./EstimatesPanel";

// Form Options Definitions
const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const FITNESS_LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Athlete"];
const DIET_OPTIONS = ["Vegetarian", "Eggetarian", "Non Vegetarian", "Vegan", "Keto", "Low Carb", "High Protein", "Mediterranean", "No Preference"];
const BUDGET_OPTIONS = ["Less than ₹150/day", "₹150–300/day", "₹300–500/day", "More than ₹500/day"];
const DURATION_OPTIONS = [15, 30, 45, 60, 90];
const WATER_GOAL_OPTIONS = ["2L", "2.5L", "3L", "3.5L", "4L"];
const SLEEP_OPTIONS = ["5 Hours", "6 Hours", "7 Hours", "8 Hours", "9 Hours", "10 Hours"];
const EQUIPMENT_OPTIONS = ["None", "Resistance Bands", "Dumbbells", "Barbell", "Machine Gym", "Full Gym"];

const GOAL_OPTIONS = [
    { name: "Lose Weight", desc: "Create a caloric deficit to drop body fat percentage safely" },
    { name: "Gain Weight", desc: "Build bulk weight with custom high-energy intake guides" },
    { name: "Build Muscle", desc: "Focus on hypertrophy routines and rich protein diets" },
    { name: "Maintain Weight", desc: "Balance energy intake to keep your current metabolic scale" },
    { name: "Improve Fitness", desc: "Increase conditioning and general cardiac stamina" },
    { name: "Increase Strength", desc: "Focus on lower reps and high loads heavy resistance lifts" },
    { name: "Improve Endurance", desc: "Extend active stamina and aerobic efficiency" },
    { name: "Body Recomposition", desc: "Lose fat and build lean tissues simultaneously" }
];

const ACTIVITY_OPTIONS = [
    { name: "Sedentary", desc: "Little or no exercise. Desk job." },
    { name: "Lightly Active", desc: "Light exercise or sports 1-3 days/week." },
    { name: "Moderately Active", desc: "Moderate exercise or sports 3-5 days/week." },
    { name: "Very Active", desc: "Hard exercise or sports 6-7 days/week." },
    { name: "Athlete", desc: "Professional sports training or heavy manual labor." }
];

const LOCATION_OPTIONS = [
    { name: "Home", desc: "Adapt movements to fit space, zero equipment, or simple accessories" },
    { name: "Gym", desc: "Optimize programs around heavy barbells, cables, and machine gyms" },
    { name: "Both", desc: "Flexible setups covering home sessions and full equipment routines" }
];

const ALLERGIES_OPTIONS = ["None", "Milk", "Peanuts", "Eggs", "Soy", "Seafood", "Gluten", "Tree Nuts", "Other"];
const INJURIES_OPTIONS = ["None", "Knee", "Back", "Shoulder", "Neck", "Hip", "Elbow", "Ankle", "Wrist"];
const CONDITIONS_OPTIONS = ["None", "Diabetes", "Hypertension", "Asthma", "Heart Disease", "Thyroid", "PCOS", "Other"];

export default function ProfileForms({
    activeTab,
    profile,
    handleChange,
    handleSelectValue,
    handleMultiSelect,
    bmi,
    bmr,
    calories
}) {
    if (activeTab === "metrics") {
        return (
            <div className="profile-section-card">
                <div className="form-group">
                    <label>Display Name</label>
                    <div className="unit-input-wrapper">
                        <input 
                            type="text" 
                            name="name" 
                            value={profile.name || ""} 
                            onChange={handleChange}
                            placeholder="Your name" 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Age</label>
                    <div className="unit-input-wrapper">
                        <input 
                            type="number" 
                            name="age" 
                            value={profile.age || ""} 
                            onChange={handleChange}
                            placeholder="e.g. 25" 
                        />
                        <span className="input-unit">Years</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Gender Selection</label>
                    <div className="chips-select-wrap">
                        {GENDER_OPTIONS.map(gOption => (
                            <button
                                key={gOption}
                                type="button"
                                className={`option-chip ${profile.gender === gOption ? "selected" : ""}`}
                                onClick={() => handleSelectValue("gender", gOption)}
                            >
                                {gOption}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Height</label>
                    <div className="unit-input-wrapper">
                        <input 
                            type="number" 
                            name="height" 
                            value={profile.height || ""} 
                            onChange={handleChange}
                            placeholder="e.g. 175" 
                        />
                        <span className="input-unit">cm</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Weight</label>
                    <div className="unit-input-wrapper">
                        <input 
                            type="number" 
                            name="weight" 
                            value={profile.weight || ""} 
                            onChange={handleChange}
                            placeholder="e.g. 72" 
                        />
                        <span className="input-unit">kg</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Average Daily Sleep</label>
                    <div className="chips-select-wrap">
                        {SLEEP_OPTIONS.map(sOption => (
                            <button
                                key={sOption}
                                type="button"
                                className={`option-chip ${profile.sleep_hours === sOption ? "selected" : ""}`}
                                onClick={() => handleSelectValue("sleep_hours", sOption)}
                            >
                                {sOption}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Daily Hydration Goal</label>
                    <div className="chips-select-wrap">
                        {WATER_GOAL_OPTIONS.map(wOption => (
                            <button
                                key={wOption}
                                type="button"
                                className={`option-chip ${profile.water_goal === wOption ? "selected" : ""}`}
                                onClick={() => handleSelectValue("water_goal", wOption)}
                            >
                                {wOption}
                            </button>
                        ))}
                    </div>
                </div>

                <EstimatesPanel bmi={bmi} bmr={bmr} calories={calories} />
            </div>
        );
    }

    if (activeTab === "lifestyle") {
        return (
            <div className="profile-section-card">
                <div className="form-group">
                    <label>Fitness Target Goal</label>
                    <div className="cards-select-grid">
                        {GOAL_OPTIONS.map(gOpt => (
                            <button
                                key={gOpt.name}
                                type="button"
                                className={`option-card ${profile.goal === gOpt.name ? "selected" : ""}`}
                                onClick={() => handleSelectValue("goal", gOpt.name)}
                            >
                                <span className="option-card-title">{gOpt.name}</span>
                                <span className="option-card-desc">{gOpt.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Dietary Preference</label>
                    <div className="chips-select-wrap">
                        {DIET_OPTIONS.map(dOption => (
                            <button
                                key={dOption}
                                type="button"
                                className={`option-chip ${profile.diet === dOption ? "selected" : ""}`}
                                onClick={() => handleSelectValue("diet", dOption)}
                            >
                                {dOption}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Daily Food Budget</label>
                    <div className="chips-select-wrap">
                        {BUDGET_OPTIONS.map(bOption => (
                            <button
                                key={bOption}
                                type="button"
                                className={`option-chip ${profile.budget === bOption || (bOption.includes("150–300") && profile.budget === 300) || (bOption.includes("Less than") && profile.budget === 150) || (bOption.includes("300–500") && profile.budget === 500) || (bOption.includes("More than") && profile.budget === 750) ? "selected" : ""}`}
                                onClick={() => handleSelectValue("budget", bOption)}
                            >
                                {bOption}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Physical Activity Index</label>
                    <div className="cards-select-grid">
                        {ACTIVITY_OPTIONS.map(actOpt => (
                            <button
                                key={actOpt.name}
                                type="button"
                                className={`option-card ${profile.activity === actOpt.name ? "selected" : ""}`}
                                onClick={() => handleSelectValue("activity", actOpt.name)}
                            >
                                <span className="option-card-title">{actOpt.name}</span>
                                <span className="option-card-desc">{actOpt.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (activeTab === "safety") {
        return (
            <div className="profile-section-card">
                <div className="form-group">
                    <label>Fitness Experience Level</label>
                    <div className="chips-select-wrap">
                        {FITNESS_LEVEL_OPTIONS.map(fOption => (
                            <button
                                key={fOption}
                                type="button"
                                className={`option-chip ${profile.fitness_level === fOption ? "selected" : ""}`}
                                onClick={() => handleSelectValue("fitness_level", fOption)}
                            >
                                {fOption}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Preferred Workout Duration</label>
                    <div className="chips-select-wrap">
                        {DURATION_OPTIONS.map(dur => (
                            <button
                                key={dur}
                                type="button"
                                className={`option-chip ${parseInt(profile.workout_duration, 10) === dur ? "selected" : ""}`}
                                onClick={() => handleSelectValue("workout_duration", dur)}
                            >
                                {dur} Mins
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Preferred Workout Environment</label>
                    <div className="cards-select-grid">
                        {LOCATION_OPTIONS.map(locOpt => (
                            <button
                                key={locOpt.name}
                                type="button"
                                className={`option-card ${profile.workout_location === locOpt.name ? "selected" : ""}`}
                                onClick={() => handleSelectValue("workout_location", locOpt.name)}
                            >
                                <span className="option-card-title">{locOpt.name}</span>
                                <span className="option-card-desc">{locOpt.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Available Equipment</label>
                    <div className="chips-select-wrap">
                        {EQUIPMENT_OPTIONS.map(eOption => (
                            <button
                                key={eOption}
                                type="button"
                                className={`option-chip ${profile.equipment === eOption ? "selected" : ""}`}
                                onClick={() => handleSelectValue("equipment", eOption)}
                            >
                                {eOption}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Allergies & Dietary Restrictions <span className="label-desc">(Multi-select)</span></label>
                    <div className="chips-select-wrap">
                        {ALLERGIES_OPTIONS.map(allergy => {
                            const selectedList = profile.allergies ? profile.allergies.split(",").map(i => i.trim()).filter(Boolean) : [];
                            const isSelected = selectedList.includes(allergy) || (allergy === "None" && selectedList.length === 0);
                            return (
                                <button
                                    key={allergy}
                                    type="button"
                                    className={`option-chip ${isSelected ? "selected" : ""}`}
                                    onClick={() => handleMultiSelect("allergies", allergy)}
                                >
                                    {allergy}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label>Injuries & Skeletal Limitations <span className="label-desc">(Multi-select)</span></label>
                    <div className="chips-select-wrap">
                        {INJURIES_OPTIONS.map(injury => {
                            const selectedList = profile.injuries ? profile.injuries.split(",").map(i => i.trim()).filter(Boolean) : [];
                            const isSelected = selectedList.includes(injury) || (injury === "None" && selectedList.length === 0);
                            return (
                                <button
                                    key={injury}
                                    type="button"
                                    className={`option-chip ${isSelected ? "selected" : ""}`}
                                    onClick={() => handleMultiSelect("injuries", injury)}
                                >
                                    {injury}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label>Medical Diagnoses & Conditions <span className="label-desc">(Multi-select)</span></label>
                    <div className="chips-select-wrap">
                        {CONDITIONS_OPTIONS.map(cond => {
                            const selectedList = profile.medical_conditions ? profile.medical_conditions.split(",").map(i => i.trim()).filter(Boolean) : [];
                            const isSelected = selectedList.includes(cond) || (cond === "None" && selectedList.length === 0);
                            return (
                                <button
                                    key={cond}
                                    type="button"
                                    className={`option-chip ${isSelected ? "selected" : ""}`}
                                    onClick={() => handleMultiSelect("medical_conditions", cond)}
                                >
                                    {cond}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
