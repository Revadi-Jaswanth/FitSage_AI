import { useState, useEffect } from "react";
import { getSummary, generateInsights } from "../api/summaryApi";
import { getProfile } from "../api/profileApi";
import { getProgressHistory, logProgress } from "../api/progressApi";
import { generateWorkout } from "../api/workoutApi";
import { generateMeal } from "../api/mealApi";
import { getRecommendations } from "../api/recommendationsApi";
import { useToast } from "../context/ToastContext";

export default function useDashboard() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [taskStatus, setTaskStatus] = useState({
        workout: "pending",
        meal: "pending",
        recommendations: "pending",
        insights: "pending"
    });
    const [setupError, setSetupError] = useState(null);

    const latestProgress = chartData.length > 0 ? chartData[chartData.length - 1] : null;

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const summaryResponse = await getSummary();
            const summaryData = summaryResponse.data.data;
            setData(summaryData);

            if (summaryData.profile_completed === false) {
                const profileResponse = await getProfile();
                setProfileData(profileResponse.data.data);
            } else if (summaryData.profile_completed === true) {
                setTaskStatus({
                    workout: summaryData.workout_status || "pending",
                    meal: summaryData.meal_status || "pending",
                    recommendations: summaryData.recommendations_status || "pending",
                    insights: summaryData.insights_status || "pending"
                });

                if (summaryData.initial_setup_completed) {
                    const historyResponse = await getProgressHistory();
                    setChartData(historyResponse.data.data);
                }
            }
        } catch (error) {
            console.error("Failed to load dashboard metrics:", error);
            showToast("Failed to load dashboard summary data.", "danger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const triggerParallelSetup = async () => {
        setSetupError(null);

        const generateWorkoutTask = async () => {
            if (taskStatus.workout === "completed") return;
            try {
                setTaskStatus(prev => ({ ...prev, workout: "running" }));
                await generateWorkout();
                setTaskStatus(prev => ({ ...prev, workout: "completed" }));
            } catch (err) {
                setTaskStatus(prev => ({ ...prev, workout: "failed" }));
                throw err;
            }
        };

        const generateMealTask = async () => {
            if (taskStatus.meal === "completed") return;
            try {
                setTaskStatus(prev => ({ ...prev, meal: "running" }));
                await generateMeal();
                setTaskStatus(prev => ({ ...prev, meal: "completed" }));
            } catch (err) {
                setTaskStatus(prev => ({ ...prev, meal: "failed" }));
                throw err;
            }
        };

        const generateRecsTask = async () => {
            if (taskStatus.recommendations === "completed") return;
            try {
                setTaskStatus(prev => ({ ...prev, recommendations: "running" }));
                await getRecommendations();
                setTaskStatus(prev => ({ ...prev, recommendations: "completed" }));
            } catch (err) {
                setTaskStatus(prev => ({ ...prev, recommendations: "failed" }));
                throw err;
            }
        };

        const generateInsightsTask = async () => {
            if (taskStatus.insights === "completed") return;
            try {
                setTaskStatus(prev => ({ ...prev, insights: "running" }));
                await generateInsights();
                setTaskStatus(prev => ({ ...prev, insights: "completed" }));
            } catch (err) {
                setTaskStatus(prev => ({ ...prev, insights: "failed" }));
                throw err;
            }
        };

        try {
            await Promise.allSettled([
                generateWorkoutTask(),
                generateMealTask(),
                generateRecsTask(),
                generateInsightsTask()
            ]);
            await fetchDashboard();
        } catch (err) {
            console.error("Parallel setup failed:", err);
            setSetupError("Setup generation failed. You can retry individual modules.");
        }
    };

    const triggerSingleTask = async (taskName) => {
        try {
            if (taskName === "workout") {
                setTaskStatus(prev => ({ ...prev, workout: "running" }));
                await generateWorkout();
                setTaskStatus(prev => ({ ...prev, workout: "completed" }));
            } else if (taskName === "meal") {
                setTaskStatus(prev => ({ ...prev, meal: "running" }));
                await generateMeal();
                setTaskStatus(prev => ({ ...prev, meal: "completed" }));
            } else if (taskName === "recommendations") {
                setTaskStatus(prev => ({ ...prev, recommendations: "running" }));
                await getRecommendations();
                setTaskStatus(prev => ({ ...prev, recommendations: "completed" }));
            } else if (taskName === "insights") {
                setTaskStatus(prev => ({ ...prev, insights: "running" }));
                await generateInsights();
                setTaskStatus(prev => ({ ...prev, insights: "completed" }));
            }

            setTaskStatus(prev => {
                const nextStatuses = { ...prev, [taskName]: "completed" };
                if (Object.values(nextStatuses).every(s => s === "completed")) {
                    fetchDashboard();
                }
                return nextStatuses;
            });
            showToast(`${taskName} module updated successfully!`, "success");
        } catch (err) {
            console.error(err);
            setTaskStatus(prev => ({ ...prev, [taskName]: "failed" }));
            showToast(`Failed to generate ${taskName} module.`, "danger");
        }
    };

    const quickLogWater = async () => {
        try {
            const today = new Date().toISOString().split("T")[0];
            const currentWater = latestProgress?.water || 0;
            const currentWeight = latestProgress?.weight || data?.dashboard?.current_weight || 70;

            await logProgress({
                date: today,
                weight: currentWeight,
                water: currentWater + 250,
                workout_completed: latestProgress?.workout_completed || 0
            });

            await fetchDashboard();
            showToast("Logged 250ml Water", "success");
        } catch (error) {
            console.error("Failed to quick-log water:", error);
            showToast("Failed to quick log water.", "danger");
        }
    };

    return {
        loading,
        data,
        profileData,
        chartData,
        taskStatus,
        setupError,
        latestProgress,
        fetchDashboard,
        triggerParallelSetup,
        triggerSingleTask,
        quickLogWater
    };
}
