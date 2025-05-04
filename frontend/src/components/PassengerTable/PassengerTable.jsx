import React from "react";
import styles from "../../styles/components/PassengerTable.module.css";

const PassengerTable = ({ passengers }) => (
    <table className={styles.table}>
        <thead>
            <tr>
                <th>Name</th>
                <th>Sex</th>
                <th>Age</th>
                <th>Survived</th>
                <th>Class</th>
                <th>Fare</th>
            </tr>
        </thead>
        <tbody>
            {passengers.map((p) => (
                <tr key={p.passenger_id}>
                    <td>{p.name}</td>
                    <td>{p.sex}</td>
                    <td>{p.age ?? "N/A"}</td>
                    <td>{p.survived ? "Yes" : "No"}</td>
                    <td>{p.pclass}</td>
                    <td>{p.fare}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default PassengerTable;