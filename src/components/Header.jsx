import React, { Suspense, lazy, useState } from "react";
import {
  Badge,
  Button,
  IconButton,
  Tooltip
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsSearch,
  setIsNotification,
  setIsNewGroup,
  setIsMobileView,
} from "../redux/reducers/misc";
import { logout, setLoading } from "../redux/reducers/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import BlackScreen from "./BlackScreen";
import NewLoader from "./NewLoader";


const SearchBar = lazy(() => import("./SearchBar"));
const Notification = lazy(() => import("./Notification"));
const NewGroup = lazy(() => import("./NewGroup"));


import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Search as SearchIcon,
  GroupAdd as GroupAddIcon,
  Close as CloseIcon,
  Groups as GroupsIcon,
  Menu as MenuIcon,
  Chat as ChatIcon
} from "@mui/icons-material";

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
    const toastId = toast.loading("Logging out...");
    try {
      dispatch(setLoading(true));
      await axios.get(`${API_BASE_URL}/api/v1/auth/logout`, { withCredentials: true });
      toast.success("Logged out");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };

  const closeInput = () => {
    dispatch(setIsSearch(false));
    setSearchQuery("");
  };

  if (loading) return <BlackScreen />;

  return (
    <header className="flex justify-between items-center p-2 container mx-auto z-50">
      <Link to="/" className="hidden md:flex items-center text-2xl font-bold">
        <ChatIcon fontSize="large" className="mr-2 text-pink-200" />
      </Link>

      <nav className="flex items-center justify-center gap-4">
        <IconButtonWithBadge
          icon={<GroupsIcon />}
          title="Groups"
          onClick={() => navigate("/groups")}
        />
        <IconButtonWithBadge
          icon={<GroupAddIcon />}
          title="Create Group"
          onClick={() => dispatch(setIsNewGroup(!isNewGroups))}
        />
        <IconButtonWithBadge
          icon={isSearch ? <CloseIcon /> : <SearchIcon />}
          title="Search"
          onClick={() => dispatch(setIsSearch(!isSearch))}
        />
        <IconButtonWithBadge
          icon={isNotification ? <NotificationsOffIcon /> : <NotificationsActiveIcon />}
          title="Notifications"
          value={notificationsCount}
          onClick={() => dispatch(setIsNotification(!isNotification))}
        />
        {user ? (
          <IconButtonWithBadge
            icon={<LoginIcon />}
            title="Logout"
            onClick={handleLogout}
          />
        ) : (
          <IconButtonWithBadge
            icon={<LogoutIcon />}
            title="Login"
            onClick={() => navigate("/login")}
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
        {isMobileView ? <CloseIcon  /> : <MenuIcon />}
      </Button>


      {isNewGroups && (
        <Suspense fallback={<NewLoader />}>
          <NewGroup onClose={() => dispatch(setIsNewGroup(false))} />
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
          <Notification onClose={() => dispatch(setIsNotification(false))} />
        </Suspense>
      )}
    </header>
  );
};


const IconButtonWithBadge = ({ title, icon, onClick, value }) => {
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
