import "../styles/cards.css";
import { Link } from "react-router-dom";

function WorkoutCard({ workout }) {

    const preview =
        workout
            ? workout.substring(0, 180) + "..."
            : "No workout generated today.";

    return (

        <div className="summary-card">

            <h3>
                💪 Today's Workout
            </h3>

            <p className="summary-text">

                {preview}

            </p>

            <p className="summary-subtitle">

                AI Personalized Routine

            </p>

            <Link
                to="/workout"
                className="card-btn"
            >
                Open Workout →
            </Link>

        </div>

    );

}

export default WorkoutCard;