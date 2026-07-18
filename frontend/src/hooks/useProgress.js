import { useState, useEffect } from "react";
import { getSummary } from "../api/summaryApi";
import { getProgressHistory, logProgress } from "../api/progressApi";
import { useToast } from "../context/ToastContext";

export default function useProgress() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profileCompleted, setProfileCompleted] = useState(true);
    const [history, setHistory] = useState([]);
    const [profileHeight, setProfileHeight] = useState(170);
    
    // Log Form State
    const [logDate, setLogDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [logWeight, setLogWeight] = useState("");
    const [logWater, setLogWater] = useState("");
    const [logCalories, setLogCalories] = useState("");
    const [workoutDone, setWorkoutDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const summaryRes = await getSummary();
            const summaryData = summaryRes.data?.data;
            if (summaryData && summaryData.profile_completed === false) {
                setProfileCompleted(false);
                return;
            }
            
            setProfileCompleted(true);
            if (summaryData?.profile?.height) {
                setProfileHeight(summaryData.profile.height);
            }
            
            // Pre-fill last logged weight in the form
            if (summaryData?.dashboard?.current_weight) {
                setLogWeight(summaryData.dashboard.current_weight.toString());
            }

            const historyRes = await getProgressHistory();
            const sorted = historyRes.data.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setHistory(sorted);
        } catch (error) {
            console.error("Failed to load progress logs:", error);
            showToast("Failed to retrieve progress log history.", "danger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleLogSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!logWeight || !logWater || !logCalories) {
            showToast("Please fill in all progress parameters.", "warning");
            return;
        }

        try {
            setSubmitting(true);
            await logProgress({
                weight: parseFloat(logWeight) || 0,
                water: parseInt(logWater, 10) || 0,
                workout_completed: workoutDone
            });

            showToast("Progress details logged successfully!", "success");
            setLogCalories("");
            setLogWater("");
            setWorkoutDone(false);
            await fetchHistory();
        } catch (error) {
            console.error("Failed to submit progress log:", error);
            showToast("Failed to log progress details.", "danger");
        } finally {
            setSubmitting(false);
        }
    };

    return {
        loading,
        profileCompleted,
        history,
        profileHeight,
        logDate,
        setLogDate,
        logWeight,
        setLogWeight,
        logWater,
        setLogWater,
        logCalories,
        setLogCalories,
        workoutDone,
        setWorkoutDone,
        submitting,
        fetchHistory,
        handleLogSubmit
    };
}
