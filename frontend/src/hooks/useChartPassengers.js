import { useEffect, useState } from "react";
import { fetchAllPassengers } from "../api/passengers";

const useChartPassengers = (filters, refreshKey = 0) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const getChartData = async () => {
            const res = await fetchAllPassengers({
                sex: filters.sex,
                survived: filters.survived,
                pclass: filters.pclass,
            });
            setChartData(res);
        };
        getChartData();
    }, [filters.sex, filters.survived, filters.pclass, refreshKey]);

    return chartData;
};

export default useChartPassengers;