import "../styles/topbar.css";

function Topbar({ onQuickLog }) {

  const today = new Date();

  const date = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  return (

    <header className="topbar">

      <div>

        <h2>Today</h2>

        <p>{date}</p>

      </div>

      <div className="topbar-right">

        <button className="top-btn">
          🔔
        </button>

        <button
          className="quick-btn"
          onClick={onQuickLog}
        >
          + Quick Log
        </button>

      </div>

    </header>

  );

}

export default Topbar;