import Navbar from "../components/bar/Navbar";
import Sidebar from "../components/bar/Sidebar";
import Table from "../components/pages/dashboard/Table";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col h-full w-full gap-2 bg-triple-light">
        <Navbar />
        <Table />
      </div>
    </div>
  );
}
