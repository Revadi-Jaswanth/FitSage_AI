import { useState } from "react";
import API from "../api/api";
import "../styles/quicklog.css";

function QuickLog({ closeModal, refreshDashboard }) {

  const [weight, setWeight] = useState("");
  const [water, setWater] = useState("");
  const [workout, setWorkout] = useState(1);

  const saveProgress = async () => {

    try {

      const email = localStorage.getItem("email");

      await API.post("/progress/log", {

        email,
        weight: parseFloat(weight) || 0,
        water: parseInt(water, 10) || 0,
        workout_completed: parseInt(workout, 10)

      });

      alert("Progress Saved Successfully!");

      refreshDashboard();

      closeModal();

    }

    catch {

      alert("Unable to save progress.");

    }

  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>Quick Daily Log</h2>

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e)=>setWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Water (ml)"
          value={water}
          onChange={(e)=>setWater(e.target.value)}
        />

        <select
          value={workout}
          onChange={(e)=>setWorkout(e.target.value)}
        >

          <option value={1}>Workout Completed</option>

          <option value={0}>Workout Missed</option>

        </select>

        <div className="buttons">

          <button onClick={saveProgress}>

            Save

          </button>

          <button onClick={closeModal}>

            Cancel

          </button>

        </div>

      </div>

    </div>

  );

}

export default QuickLog;