import { useState, useEffect } from "react";
import { generateWorkout } from "../api/workoutApi";
import { useToast } from "../context/ToastContext";

// Markdown parser helper for workout plans
function parseWorkoutMarkdown(text) {
    if (!text) return [];
    
    const sections = text.split(/(?=DAY\s+\d+)/i);
    const days = [];
    
    sections.forEach((sec) => {
        const lines = sec.trim().split("\n");
        if (lines.length === 0 || !lines[0].toLowerCase().startsWith("day")) return;
        
        const firstLine = lines[0];
        const dayMatch = firstLine.match(/DAY\s+(\d+)/i);
        const dayNum = dayMatch ? dayMatch[1] : days.length + 1;
        
        let title = firstLine.replace(/DAY\s+\d+\s*-?\s*/i, "").trim();
        let difficulty = "Beginner";
        const diffMatch = title.match(/\[(.*?)\]/);
        if (diffMatch) {
            difficulty = diffMatch[1];
            title = title.replace(/\[.*?\]/, "").trim();
        }
        
        let duration = "45";
        let calories = "300";
        let muscles = [];
        const exercises = [];
        
        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("- Duration:")) {
                const durMatch = trimmed.match(/Duration:\s*(\d+)/i);
                if (durMatch) duration = durMatch[1];
                const calMatch = trimmed.match(/Calories Burned:\s*(\d+)/i);
                if (calMatch) calories = calMatch[1];
            } else if (trimmed.startsWith("- Target Muscle Groups:")) {
                muscles = trimmed.replace("- Target Muscle Groups:", "").trim().split(",").map(m => m.trim());
            } else if (trimmed.startsWith("- ") && !trimmed.toLowerCase().includes("duration") && !trimmed.toLowerCase().includes("muscle") && !trimmed.toLowerCase().includes("exercises:")) {
                const exText = trimmed.replace(/^[-*]\s*/, "");
                const parts = exText.split(":");
                if (parts.length >= 2) {
                    const name = parts[0].trim();
                    const details = parts.slice(1).join(":").trim();
                    exercises.push({ name, details });
                } else {
                    exercises.push({ name: exText, details: "" });
                }
            }
        });
        
        days.push({
            day: dayNum,
            title,
            difficulty,
            duration,
            calories,
            muscles,
            exercises
        });
    });
    
    return days;
}

export default function useWorkout() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profileCompleted, setProfileCompleted] = useState(true);
    const [days, setDays] = useState([]);
    const [activeDayIdx, setActiveDayIdx] = useState(0);
    const [expandedExIdx, setExpandedExIdx] = useState(null);
    const [checkedState, setCheckedState] = useState({});

    const fetchWorkout = async (force = false) => {
        try {
            setLoading(true);
            const response = await generateWorkout(force);
            const parsed = parseWorkoutMarkdown(response.data.data.workout_plan);
            setDays(parsed);
            setProfileCompleted(true);
            if (parsed.length > 0) {
                setActiveDayIdx(0);
            }
            if (force) {
                showToast("Workout plan regenerated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to load workout:", error);
            if (error.response && error.response.status === 400) {
                setProfileCompleted(false);
            } else {
                showToast("Failed to retrieve workout plan.", "danger");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkout();
    }, []);

    const toggleCheck = (dayIndex, exIndex) => {
        const key = `${dayIndex}-${exIndex}`;
        setCheckedState((prev) => {
            const updated = { ...prev, [key]: !prev[key] };
            if (updated[key]) {
                showToast("Exercise completed! Keep it up.", "success");
            }
            return updated;
        });
    };

    const toggleExpand = (index) => {
        setExpandedExIdx(expandedExIdx === index ? null : index);
    };

    return {
        loading,
        profileCompleted,
        days,
        activeDayIdx,
        setActiveDayIdx,
        expandedExIdx,
        checkedState,
        fetchWorkout,
        toggleCheck,
        toggleExpand
    };
}
