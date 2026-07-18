import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api/profileApi";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function useProfile() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("metrics");

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getProfile();
            setProfile(response.data.data);
        } catch (error) {
            console.error("Failed to load profile details:", error);
            showToast("Failed to retrieve profile details.", "danger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSelectValue = (field, value) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMultiSelect = (field, value) => {
        setProfile((prev) => {
            const currentStr = prev[field] || "";
            const currentList = currentStr.split(",").map(i => i.trim()).filter(Boolean);
            
            if (value === "None") {
                return { ...prev, [field]: "None" };
            }
            
            let newList;
            if (currentList.includes(value)) {
                newList = currentList.filter(item => item !== value);
            } else {
                newList = [...currentList.filter(item => item !== "None"), value];
            }
            
            if (newList.length === 0) {
                newList = ["None"];
            }
            
            return { ...prev, [field]: newList.join(", ") };
        });
    };

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const calculateLiveEstimates = () => {
        if (!profile) return { bmi: "--", bmr: "--", calories: "--" };
        
        const w = parseFloat(profile.weight);
        const h = parseFloat(profile.height);
        const a = parseInt(profile.age, 10);
        const g = profile.gender;
        const act = profile.activity;
        const goal = profile.goal;

        if (!w || !h || !a || !g || !act || !goal) {
            return { bmi: "--", bmr: "--", calories: "--" };
        }

        const bmi = (w / ((h / 100) ** 2)).toFixed(1);

        let s = -78;
        if (g.toLowerCase() === "male") s = 5;
        else if (g.toLowerCase() === "female") s = -161;

        const bmr = Math.round((10 * w) + (6.25 * h) - (5 * a) + s);

        let multiplier = 1.375;
        const actLower = act.toLowerCase();
        if (actLower.includes("sedentary")) multiplier = 1.2;
        else if (actLower.includes("light")) multiplier = 1.375;
        else if (actLower.includes("moderate")) multiplier = 1.55;
        else if (actLower.includes("very")) multiplier = 1.725;
        else if (actLower.includes("athlete")) multiplier = 1.9;

        const tdee = bmr * multiplier;

        let calories = tdee;
        const goalLower = goal.toLowerCase();
        if (goalLower.includes("lose")) calories = tdee - 500;
        else if (goalLower.includes("gain") || goalLower.includes("build")) calories = tdee + 300;

        calories = Math.max(1200, Math.round(calories));

        return { bmi, bmr, calories };
    };

    const calculateOnboardingProgress = () => {
        if (!profile) return 0;
        const requiredFields = [
            profile.age, profile.gender, profile.height, profile.weight, 
            profile.goal, profile.diet, profile.budget, profile.activity, 
            profile.equipment, profile.fitness_level, profile.workout_duration, 
            profile.workout_location, profile.water_goal, profile.sleep_hours
        ];
        const completed = requiredFields.filter(val => val !== null && String(val).trim() !== "").length;
        return Math.round((completed / requiredFields.length) * 100);
    };

    const saveProfile = async () => {
        try {
            setSaving(true);
            const response = await updateProfile(profile);
            
            if (response.data.success) {
                showToast("Profile Updated Successfully!", "success");
                navigate("/dashboard");
            } else {
                showToast("Failed to save: " + response.data.message, "danger");
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
            showToast("Something went wrong saving details.", "danger");
        } finally {
            setSaving(false);
        }
    };

    return {
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
    };
}
