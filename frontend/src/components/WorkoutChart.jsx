import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

function WorkoutChart({ data }) {

    return (

        <ResponsiveContainer
            width="100%"
            height={300}
        >

            <BarChart data={data}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="date"/>

                <YAxis/>

                <Tooltip/>

                <Bar
                    dataKey="workout_completed"
                    fill="#40c057"
                    radius={[8,8,0,0]}
                />

            </BarChart>

        </ResponsiveContainer>

    );

}

export default WorkoutChart;