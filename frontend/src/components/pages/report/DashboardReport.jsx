// import { useEffect, useState } from "react";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { HiOutlineStatusOnline } from "react-icons/hi";
import ReportCard from "./ReportCard";
import ReportGraphic from "./ReportGraphic";
import TableReport from "./TableReport";

export default function DashboardReport() {
    // const [totalEmployees, setTotalEmployees] = useState(null);
    // const [onlineEmployees, setOnlineEmployees] = useState(null);
    // const [monthEmployees, setMonthEmployees] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     fetch("http://localhost:4000/user", {
    //         method: "GET",
    //         credentials: "include",
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             const id = data.response[0]?.id;
    //             if (!id) throw new Error("User tidak ditemukan!");

    //             return Promise.all([
    //                 fetch(`http://localhost:4000/employee/count/${id}`).then((res) => res.json()),
    //                 fetch(`http://localhost:4000/employee/online/${id}`).then((res) => res.json()),
    //                 fetch(`http://localhost:4000/employee/month/${id}`).then((res) => res.json())
    //             ]);
    //         })
    //         .then(([currentCount, onlineCount, monthCount]) => {
    //             setTotalEmployees(currentCount);
    //             setOnlineEmployees(onlineCount.count);
    //             setMonthEmployees(monthCount.count)
    //         })
    //         .catch((err) => setError(err.message))
    //         .finally(() => setLoading(false));
    // }, []);

    return (
        <div className="flex flex-col h-full w-full py-4 px-8 gap-4 overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
                <ReportCard
                    icon={FaUser}
                    title="Total number of staff"
                    // count={loading ? "Loading..." : error ? "Error!" : totalEmployees}
                    color="text-blue-900"
                />
                <ReportCard
                    icon={HiOutlineStatusOnline}
                    title="Employees Online Today"
                    // count={loading ? "Loading..." : error ? "Error!" : onlineEmployees}
                    color="text-green-500"
                />
                <ReportCard
                    icon={FaUserPlus}
                    title="New Employees This Month"
                    // count={loading ? "Loading..." : error ? "Error!" : monthEmployees}
                    color="text-orange-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ReportGraphic
                    icon={FaUser}
                    title="Total number of staff"
                    // count={loading ? "Loading..." : error ? "Error!" : totalEmployees}
                    color="text-blue-900"
                />
                <ReportGraphic
                    icon={HiOutlineStatusOnline}
                    title="Employees Online Today"
                    // count={loading ? "Loading..." : error ? "Error!" : onlineEmployees}
                    color="text-green-500"
                />
            </div>

            <TableReport />

        </div>
    );
}
