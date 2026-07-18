import "../styles/cards.css";

function GoalCard({ progress, workout, meal }) {

    const goals = [

        {
            title: "Workout Completed",
            done: progress
                ? progress.workout_completed === 1
                : false
        },

        {
            title: "Water Goal (2500 ml)",
            done: progress
                ? progress.water >= 2500
                : false
        },

        {
            title: "Weight Logged",
            done: progress
                ? progress.weight > 0
                : false
        },

    ];

    const completedGoals =
        goals.filter(goal => goal.done).length;

    const totalGoals =
        goals.length;

    const percentage =
        Math.round(
            (completedGoals / totalGoals) * 100
        );

    return (

        <div className="goal-card">

            <h2>
                🎯 Today's Goals
            </h2>

            <p className="goal-summary">

                {completedGoals} / {totalGoals} Goals Completed

            </p>

            <div className="progress-bar">

                <div

                    className="progress-fill"

                    style={{
                        width: `${percentage}%`
                    }}

                ></div>

            </div>

            <p className="goal-percent">

                {percentage}% Complete

            </p>

            {

                goals.map((goal, index) => (

                    <div

                        key={index}

                        className="goal-item"

                    >

                        <span className="goal-icon">

                            {

                                goal.done

                                    ?

                                    "✅"

                                    :

                                    "⬜"

                            }

                        </span>

                        <p>

                            {goal.title}

                        </p>

                    </div>

                ))

            }

        </div>

    );

}

export default GoalCard;