import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "../../styles/components/PassengerChart.module.css";

const PassengerChart = ({ data }) => {
    const survivalByClass = [1, 2, 3].map((cls) => {
        const total = data.filter((p) => Number(p.pclass) === cls).length;
        const survived = data.filter((p) => Number(p.pclass) === cls && Boolean(p.survived)).length;
        return {
            name: `Class ${cls}`,
            Survived: survived,
            Died: total - survived,
        };
    });

    return (
        <ResponsiveContainer width="100%" height={300} className={styles.chartCard}>
            <BarChart data={survivalByClass}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Survived" fill="#4caf50" />
                <Bar dataKey="Died" fill="#f44336" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default PassengerChart;