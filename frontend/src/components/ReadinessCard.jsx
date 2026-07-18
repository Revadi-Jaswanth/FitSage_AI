import "../styles/cards.css";

function ReadinessCard({ progress }) {

  let score = 50;

  if (progress) {

    if (progress.workout_completed)
      score += 20;

    if (progress.water >= 2500)
      score += 15;

    if (progress.weight > 0)
      score += 15;

  }

  let message = "";

  if (score >= 90) {

    message = "Excellent! You're fully ready today.";

  }

  else if (score >= 75) {

    message = "Great! You're ready for today's workout.";

  }

  else if (score >= 60) {

    message = "Good. Drink more water and stay active.";

  }

  else {

    message = "Let's start logging today's activities.";

  }

  return (

    <div className="readiness-card">

      <h2>

        🔥 Daily Readiness

      </h2>

      <div className="circle">

        {score}%

      </div>

      <p>

        {message}

      </p>

    </div>

  );

}

export default ReadinessCard;