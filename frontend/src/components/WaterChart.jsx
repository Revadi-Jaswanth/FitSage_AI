import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

function WaterChart({ data }) {

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
                    dataKey="water"
                    fill="#4dabf7"
                    radius={[8,8,0,0]}
                />

            </BarChart>

        </ResponsiveContainer>

    );

}

export default WaterChart;