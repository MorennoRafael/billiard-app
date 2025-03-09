import TableBilliard from "./TableBilliard";
import { FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import { MdOutlineTableBar } from "react-icons/md";
import EmployeeCard from "../employee/EmployeeCard";
import { useState, useEffect } from "react";

export default function DashboardTable() {
    const [totalTables, setTotalTables] = useState(null);
    const [onlineTables, setOnlineTables] = useState(null);
    const [monthTables, setMonthTables] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:4000/user", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                const id = data.response[0]?.id;
                if (!id) throw new Error("User tidak ditemukan!");

                return Promise.all([
                    fetch(`http://localhost:4000/tables/count/${id}`).then((res) => res.json()),
                    fetch(`http://localhost:4000/tables/online/${id}`).then((res) => res.json()),
                    fetch(`http://localhost:4000/tables/month/${id}`).then((res) => res.json())
                ]);
            })
            .then(([currentCount, onlineCount, monthCount]) => {
                setTotalTables(currentCount);
                setOnlineTables(onlineCount.count);
                setMonthTables(monthCount.count)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col h-full w-full py-4 px-8 gap-8 overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
                <EmployeeCard
                    icon={MdOutlineTableBar}
                    title="Total number of tables"
                    count={loading ? "Loading..." : error ? "Error!" : totalTables}
                    color="text-blue-900"
                />
                <EmployeeCard
                    icon={FaCheckCircle}
                    title="Active Tables"
                    count={loading ? "Loading..." : error ? "Error!" : onlineTables}
                    color="text-green-500"
                />
                <EmployeeCard
                    icon={FaPlusCircle}
                    title="New Tables Added"
                    count={loading ? "Loading..." : error ? "Error!" : monthTables}
                    color="text-orange-500"
                />
            </div>
            <TableBilliard />
        </div>
    )
}