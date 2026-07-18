import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function WeightChart({ data }) {

  const chartData = data.map((item) => ({

    ...item,

    date: new Date(item.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short"
    })

  }));

  return (

    <ResponsiveContainer
      width="100%"
      height={320}
    >

      <LineChart data={chartData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
        />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="weight"
          stroke="#1b4332"
          strokeWidth={3}
          dot={{ r: 5 }}
          activeDot={{ r: 8 }}
        />

      </LineChart>

    </ResponsiveContainer>

  );

}

export default WeightChart;