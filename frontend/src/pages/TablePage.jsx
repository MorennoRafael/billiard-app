import DashboardTable from "@/components/pages/table/DashboardTable";
import Navbar from "../components/bar/Navbar";
import Sidebar from "../components/bar/Sidebar";

export default function TablePage() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col h-full w-full gap-2 bg-triple-light">
                <Navbar />
                <DashboardTable />
            </div>
        </div>
    );
}
