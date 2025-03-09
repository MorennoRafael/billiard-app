import DashboardReport from "@/components/pages/report/DashboardReport";
import Navbar from "../components/bar/Navbar";
import Sidebar from "../components/bar/Sidebar";

export default function Report() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col h-full w-full bg-triple-light">
                <Navbar />
                <DashboardReport />
            </div>
        </div>
    );
}
