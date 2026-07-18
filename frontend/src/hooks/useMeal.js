import { useState, useEffect } from "react";
import { generateMeal } from "../api/mealApi";
import { useToast } from "../context/ToastContext";

// Markdown parser helper for meal plans
function parseMealMarkdown(text) {
    if (!text) return { meals: [], shoppingList: [] };
    
    const parts = text.split(/Shopping\s+List:/i);
    const mealPart = parts[0];
    const shoppingPart = parts.length > 1 ? parts[1] : "";
    
    // Split by Breakfast, Lunch, Snack, Dinner
    const mealSections = mealPart.split(/(?=(?:Breakfast|Lunch|Snack|Dinner|Snacks):\s*)/i);
    const meals = [];
    
    mealSections.forEach((sec) => {
        const lines = sec.trim().split("\n");
        if (lines.length === 0) return;
        
        const firstLine = lines[0].trim();
        if (!firstLine.endsWith(":")) return;
        const type = firstLine.slice(0, -1).trim();
        
        let name = "Healthy Dish";
        let calories = 0;
        let protein = 0;
        let carbs = 0;
        let fat = 0;
        let ingredients = [];
        let preparation = "";
        
        if (lines.length > 1) {
            const secondLine = lines[1].trim();
            const detailParts = secondLine.split("|");
            name = detailParts[0].trim();
            
            detailParts.forEach((part) => {
                const lower = part.toLowerCase();
                if (lower.includes("calories")) {
                    const match = part.match(/calories:\s*(\d+)/i);
                    if (match) calories = parseInt(match[1], 10);
                } else if (lower.includes("protein")) {
                    const match = part.match(/protein:\s*(\d+)/i);
                    if (match) protein = parseInt(match[1], 10);
                } else if (lower.includes("carbs")) {
                    const match = part.match(/carbs:\s*(\d+)/i);
                    if (match) carbs = parseInt(match[1], 10);
                } else if (lower.includes("fat")) {
                    const match = part.match(/fat:\s*(\d+)/i);
                    if (match) fat = parseInt(match[1], 10);
                }
            });
        }
        
        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("Ingredients:")) {
                ingredients = trimmed.replace("Ingredients:", "").trim().split(",").map(i => i.trim());
            } else if (trimmed.startsWith("Preparation:")) {
                preparation = trimmed.replace("Preparation:", "").trim();
            }
        });
        
        meals.push({
            type,
            name,
            calories,
            protein,
            carbs,
            fat,
            ingredients,
            preparation
        });
    });
    
    const shoppingList = [];
    if (shoppingPart) {
        const lines = shoppingPart.trim().split("\n");
        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("- ")) {
                shoppingList.push(trimmed.replace(/^-\s*/, "").trim());
            }
        });
    }
    
    return { meals, shoppingList };
}

export default function useMeal() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profileCompleted, setProfileCompleted] = useState(true);
    const [meals, setMeals] = useState([]);
    const [shopping, setShopping] = useState([]);
    const [boughtState, setBoughtState] = useState({});

    const fetchMeals = async (force = false) => {
        try {
            setLoading(true);
            const response = await generateMeal(force);
            const { meals: parsedMeals, shoppingList } = parseMealMarkdown(response.data.data.meal_plan);
            setMeals(parsedMeals);
            setShopping(shoppingList);
            setProfileCompleted(true);
            if (force) {
                showToast("Meal plan regenerated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to load meal planner:", error);
            if (error.response && error.response.status === 400) {
                setProfileCompleted(false);
            } else {
                showToast("Failed to retrieve meal plan.", "danger");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    const toggleBought = (itemIndex) => {
        setBoughtState((prev) => {
            const updated = { ...prev, [itemIndex]: !prev[itemIndex] };
            if (updated[itemIndex]) {
                showToast("Added item to basket!", "info");
            }
            return updated;
        });
    };

    return {
        loading,
        profileCompleted,
        meals,
        shopping,
        boughtState,
        fetchMeals,
        toggleBought
    };
}
