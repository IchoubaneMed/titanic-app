import React, { useEffect, useState } from "react";
import UploadForm from "../components/UploadForm/UploadForm";
import PassengerTable from "../components/PassengerTable/PassengerTable";
import PassengerChart from "../components/PassengerChart/PassengerChart";
import Filters from "../components/Filters/Filters";
import usePassengers from "../hooks/usePassengers";
import useChartPassengers from "../hooks/useChartPassengers";
import { deleteAllPassengers } from "../api/passengers";
import { toast } from "react-toastify";
import styles from "../styles/components/Dashboard.module.css";

const Dashboard = () => {
    const [filters, setFilters] = useState({ sex: "", survived: "", pclass: "", page: 1, });

    const [tableRefreshKey, setTableRefreshKey] = useState(0);
    const [chartRefreshKey, setChartRefreshKey] = useState(0);

    const refreshData = () => {
        setTableRefreshKey((prev) => prev + 1);
        setChartRefreshKey((prev) => prev + 1);
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you sure you want to delete all passenger data?")) return;
        try {
            const res = await deleteAllPassengers();
            toast.success(res.message || "All data deleted.");
            refreshData(); // refresh chart + table
        } catch (err) {
            toast.error("Failed to delete passengers.");
            console.error(err);
        }
    };

    // Table data: paginated
    const { data: passengers, pagination } = usePassengers(filters, tableRefreshKey);
    // Chart data: ALL filtered passengers (no pagination)
    const chartData = useChartPassengers(filters, chartRefreshKey);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
    };

    const goToPage = (direction) => {
        setFilters((prev) => ({
            ...prev,
            page: direction === "next" ? prev.page + 1 : prev.page - 1,
        }));
    };

    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.heading}>Titanic Dashboard</h2>
            <UploadForm onUploadSuccess={refreshData} onDeleteAll={handleDeleteAll} />
            <Filters filters={filters} onChange={handleFilterChange} />
            <PassengerChart data={chartData} />
            <PassengerTable passengers={passengers} />

            {/* Pagination Controls */}
            <div className={styles.paginationControls}>
                <button className={styles.paginationButton} onClick={() => goToPage("prev")} disabled={!pagination.previous}>
                    ◀ Previous
                </button>
                <button className={styles.paginationButton} onClick={() => goToPage("next")} disabled={!pagination.next}>
                    Next ▶
                </button>
            </div>
        </div>
    );
};

export default Dashboard;