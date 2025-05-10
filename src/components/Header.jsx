import React, { Suspense, lazy, useEffect, useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import toast from "react-hot-toast";
import { FaPeopleGroup } from "react-icons/fa6";
import { FiMenu, FiX } from "react-icons/fi";
import { SiLiberadotchat } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import BlackScreen from "./BlackScreen";
import NewLoader from "./NewLoader";
import { useSelector, useDispatch } from "react-redux";
import { logout, setLoading } from "../redux/reducers/auth";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import {
  setIsSearch,
  setIsNotification,
  setIsNewGroup,
  setIsMobileView,
} from "../redux/reducers/misc";
import Badge from "@mui/material/Badge";
import { Button, IconButton } from "@mui/material";
const SearchBar = lazy(() => import("./SearchBar"));
const Notification = lazy(() => import("./Notification"));
const NewGroup = lazy(() => import("./NewGroup"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSearch, isNotification, isNewGroups, isMobileView } = useSelector(
    (state) => state.misc
  );
  const { user, loading } = useSelector((state) => state.auth);
  const { notificationsCount } = useSelector((state) => state.chat);

  const [searchQuery, setSearchQuery] = useState("");
  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      toast.success("Logged out");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const closeInput = () => {
    dispatch(setIsSearch(false));
    setSearchQuery("");
  };

  if (loading) return <BlackScreen />;

  return (
    <header className=" justify-between flex p-2 container mx-auto z-50">
      <Link to="/" className="hidden md:flex items-center text-2xl font-bold">
        <SiLiberadotchat size={30} className="mr-2 text-pink-200" />
      </Link>

      <nav className="flex items-center justify-center gap-4 ">
        <Icon
          icon={<FaPeopleGroup size={25} />}
          onClick={() => navigate("/groups")}
          title={"groups"}
        />
        <Icon
          icon={<GroupAddIcon />}
          onClick={() => dispatch(setIsNewGroup(!isNewGroups))}
          title={"create"}
        />

        <Icon
          icon={isSearch ? <CloseIcon /> : <SearchIcon />}
          onClick={() => dispatch(setIsSearch(!isSearch))}
          title={"search"}
        />

        <Icon
          icon={
            isNotification ? (
              <NotificationsOffIcon />
            ) : (
              <NotificationsActiveIcon />
            )
          }
          onClick={() => dispatch(setIsNotification(!isNotification))}
          value={notificationsCount}
          title={"notifications"}
        />

        {user ? (
          <Icon
            icon={<LoginIcon />}
            onClick={() => handleLogout()}
            title={"logout"}
          />
        ) : (
          <Icon
            icon={<LogoutIcon />}
            onClick={() => navigate("/login")}
            title={"login"}
          />
        )}
      </nav>

      <Button
      sx={{
        minWidth: "44px", 
        width: "44px",
        height: "44px",
        display: { xs: "block", sm: "none" },
        backgroundColor: "transparent",
        color: "black",
        "&:hover": {
          backgroundColor: "#f3f4f6", 
        },
      }}
      onClick={() => dispatch(setIsMobileView(!isMobileView))}
    >
      {isMobileView ? <FiX size={28} /> : <FiMenu size={28} />}
    </Button>

      {isNewGroups && (
        <Suspense fallback={<NewLoader />}>
          <NewGroup onClose={() => dispatch(setIsNewGroup(!isNewGroups))} />
        </Suspense>
      )}

      {isSearch && (
        <Suspense fallback={<NewLoader />}>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            title="Users and Groups"
            onClear={() => setSearchQuery("")}
            onClose={closeInput}
          />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<NewLoader />}>
          <Notification
            onClose={() => dispatch(setIsNotification(false))}
          />
        </Suspense>
      )}
    </header>
  );
};

const Icon = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
