import "../styles/cards.css";

function StatCard({

title,

value,

unit,

icon

}){

return(

<div className="stat-card">

<div className="stat-icon">

{icon}

</div>

<h4>

{title}

</h4>

<h2>

{value}

<span>

{unit}

</span>

</h2>

</div>

);

}

export default StatCard;