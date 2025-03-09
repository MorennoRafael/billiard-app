import { useEffect, useState } from "react";
import io from "socket.io-client";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const socket = io("http://localhost:4000", { withCredentials: true });

export default function Navbar() {
  const [onlineTables, setOnlineTables] = useState(0);
  const [totalTables, setTotalTables] = useState(10);
  console.log(totalTables)
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch("http://localhost:4000/user", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (data.response && data.response.length > 0) {
          setUserId(data.response[0].id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchTableCounts = async () => {
      try {
        const [countRes, onlineRes] = await Promise.all([
          fetch(`http://localhost:4000/tables/count/${userId}`),
          fetch(`http://localhost:4000/tables/online/${userId}`),
        ]);

        const countData = await countRes.json();
        const onlineData = await onlineRes.json();

        setTotalTables(countData || 0);
        setOnlineTables(onlineData.count || 0);
      } catch (error) {
        console.error("Error fetching table counts:", error);
      }
    };

    fetchTableCounts();

    socket.on("tableUpdated", fetchTableCounts);
    socket.on("tableAdded", fetchTableCounts);

    return () => {
      socket.off("tableUpdated", fetchTableCounts);
      socket.off("tableAdded", fetchTableCounts);
    };
  }, [userId]);


  return (
    <div className="flex items-center justify-between py-2 px-3 bg-white border-b border-double-light shadow-xs [box-shadow:2px_0_4px_-1px_#D3D3D3]">
      <div className="flex items-center gap-2">
        <div className="flex border-primary-light border-r-2 pr-2 text-black-primary cursor-pointer">
          <FaArrowLeft size={18} />
        </div>

        <div className="flex items-center gap-2 font-bold text-primary-light cursor-pointer">
          <div className="flex items-center gap-1">
            <HiOutlineChartSquareBar size={18} />
            <p className="text-base">Report</p>
          </div>
          <IoIosArrowForward size={18} />
        </div>

        <div className="flex items-center gap-2 font-bold text-black-primary cursor-pointer">
          <div className="flex items-center gap-1">
            <FaMoneyBillWave size={18} />
            <p className="text-base">Income</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-3 *:ring-3 *:ring-background">
          <Avatar>
            <AvatarImage src="images/avatars/avatar-1.jpg" />
          </Avatar>
          <Avatar>
            <AvatarImage src="images/avatars/avatar-2.jpg" />
          </Avatar>
          <Avatar>
            <AvatarImage src="images/avatars/avatar-3.jpg" />
          </Avatar>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-triple-light font-bold text-primary-light">
          <p className="text-base">{onlineTables}/{totalTables}</p>
          <p className="text-base">Tersedia</p>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-triple-light font-bold text-primary-light">
          <div className="flex items-center gap-1">
            <FaRegCalendarAlt size={22} />
            <p className="text-base">{new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
