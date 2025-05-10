import { MdDashboard, MdLogout } from "react-icons/md";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { HiUsers } from "react-icons/hi2";
import { MdGroups2 } from "react-icons/md";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config.js";

const SideBar = ({ width }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handlerLogout = async () => {
        const toastId = toast.loading("logging out...")
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/admin/logout`, {
                withCredentials: true,
            });
            if(response.data.success) {
                toast.success("Logged out")
                navigate("/admin-login");
            }
        } catch (error) {
            console.log(error);
            toast.error("Couldn't log out")
        } finally {
            toast.dismiss(toastId)
        }
    };

    const adminRoutes = [
        {
            path: "dashboard",
            component: "Dashboard",
            icon: <MdDashboard size={20} />,
        },
        {
            path: "users",
            component: "Users",
            icon: <HiUsers size={20} />,
        },
        {
            path: "messages",
            component: "messages",
            icon: <MessageCircle size={20} />,
        },
        {
            path: "chats",
            component: "chats",
            icon: <MdGroups2 size={20} />,
        },
    ];

    return (
        <div
            className={`h-screen relative p-2 flex flex-col justify-between bg-white`}
        >
            <div>
                <h2 className="text-2xl font-bold mb-6 text-left">ADMIN</h2>
                <nav className="flex flex-col gap-4 p_font">
                    {adminRoutes.map((route, index) => {
                        const isActive = location.pathname.includes(route.path);
                        return (
                            <Link
                                key={index}
                                to={`/admin/${route.path}`}
                                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-300 w-full
                    ${isActive
                                        ? "bg-black shadow-md text-white"
                                        : "hover:bg-gray-800 text-black hover:text-white"
                                    }`}
                            >
                                {route.icon}
                                <span className="text-[16px] font-normal">
                                    {route.component}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="w-full flex justify-center">
                <Tooltip title={"Logout"}>
                    <button
                        onClick={handlerLogout}
                        className="flex items-center justify-center gap-4 bg-red-500 px-4 py-2 rounded-full transition-all duration-300 hover:bg-red-600 text-white font-medium"
                    >
                        Logout
                        <MdLogout size={20} className="ml-2" />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default SideBar;
