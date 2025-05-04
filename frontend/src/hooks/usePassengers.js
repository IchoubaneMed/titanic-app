import { useEffect, useState } from "react";
import { fetchPassengers } from "../api/passengers";

const usePassengers = (filters, refreshKey = 0) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ next: null, previous: null })

    useEffect(() => {
        fetchPassengers(filters).then((res) => {
            setData(res.results || []);
            setPagination({ next: res.next, previous: res.previous });
        });
    }, [filters, refreshKey]);

    return { data, pagination };
};

export default usePassengers;