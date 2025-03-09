import DashboardEmployee from "@/components/pages/employee/dashboardEmployee";
import Navbar from "../components/bar/Navbar";
import Sidebar from "../components/bar/Sidebar";

export default function Employee() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col h-full w-full gap-2 bg-triple-light">
                <Navbar />
                <DashboardEmployee />
            </div>
        </div>
    );
}
