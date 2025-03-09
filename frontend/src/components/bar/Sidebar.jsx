import Icon from "@mdi/react";
import { useState } from "react";
import { mdiBilliards } from "@mdi/js";
import { IoIosArrowBack } from "react-icons/io";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import { MdOutlineTableBar, MdOutlineGroupAdd } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentPath = window.location.pathname;
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = await Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out!",
      cancelButtonText: "Cancel",
    });

    if (confirmLogout.isConfirmed) {
      try {
        const response = await fetch("http://localhost:4000/logout", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Logout failed");

        Swal.fire({
          title: "Logged Out!",
          text: "You will be redirected to the login page.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/login");
        });
      } catch (error) {
        Swal.fire({
          title: "Logout Failed!",
          text: "An error occurred, please try again.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        console.error("Logout failed:", error);
      }
    }
  };


  return (
    <div
      className={`relative flex-shrink-0 h-full ${isCollapsed ? "w-[4rem]" : "w-[15%]"}`}
    >
      <div
        className="absolute top-[50%] -right-2 z-10 w-4 h-10 bg-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <IoIosArrowBack
          className={`w-full h-full text-black-primary transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
        />
      </div>
      <div className="flex flex-col h-full bg-white px-4 py-6 border-r border-[#D3D3D3] shadow-xs [box-shadow:2px_0_4px_-1px_#D3D3D3] justify-between">
        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-1">
            <Icon path={mdiBilliards} size={1.5} className="text-black-primary" />
            {!isCollapsed && <h3 className="font-bold text-xl text-black-primary">Billiard</h3>}
          </div>
          <div className="flex flex-col gap-5">
            {[
              { icon: <RiDashboardLine size="26px" />, text: "Dashboard", href: "/" },
              { icon: <HiOutlineChartSquareBar size="26px" />, text: "Report", href: "/report" },
              { icon: <MdOutlineTableBar size="26px" />, text: "Table", href: "/tables" },
              { icon: <MdOutlineGroupAdd size="26px" />, text: "Employee", href: "/employees" },
            ].map(({ icon, text, href }, index) => {
              const isActive = currentPath === href;
              return (
                <div key={index} className="flex items-center justify-between">
                  <a
                    href={href}
                    className={`flex items-center gap-2 cursor-pointer ${isActive ? "text-black-primary font-bold" : "text-primary-light"
                      } hover:text-black-primary`}
                  >
                    {icon}
                    {!isCollapsed && <p className="text-base font-bold">{text}</p>}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { icon: <IoMdLogOut size="26px" />, text: "Logout" },
          ].map(({ icon, text, href }, index) => {
            const isActive = currentPath === href;
            return (
              <a
                key={index}
                href={href}
                onClick={handleLogout}
                className={`flex items-center gap-2 cursor-pointer ${isActive ? "text-black-primary font-bold" : "text-primary-light"
                  } hover:text-black-primary`}
              >
                {icon}
                {!isCollapsed && <p className="text-base font-bold">{text}</p>}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
