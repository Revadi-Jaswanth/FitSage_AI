import "../styles/cards.css";
import { Link } from "react-router-dom";

function MealCard({ meal }) {

    const preview =
        meal
            ? meal.substring(0, 150) + "..."
            : "No meal plan generated today.";

    return (

        <div className="summary-card">

            <h3>
                🥗 Today's Meal
            </h3>

            <p className="summary-text">

                {preview}

            </p>

            <p className="summary-subtitle">

                High Protein • AI Generated

            </p>

            <Link
                to="/meal"
                className="card-btn"
            >
                View Meal →
            </Link>

        </div>

    );

}

export default MealCard;