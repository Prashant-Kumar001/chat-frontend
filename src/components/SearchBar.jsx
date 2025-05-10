import React, { memo, useState, useEffect, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import UserItem from "../shared/UserItem.jsx";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../redux/api/api.js";
import { useDebounce } from "../hooks/hook";
import LoopIcon from "@mui/icons-material/Loop";
import { animations } from "../lib/features.js";

const SearchBar = ({ value, onChange, onClose, onClear, title }) => {
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [users, setUsers] = useState([]);
  const debouncedValue = useDebounce(value, 1000);

  const [searchQuery] = useLazySearchUserQuery();
  const [sendFriendRequest] = useSendFriendRequestMutation();

  useEffect(() => {
    setLoadingSearch(true);
    searchQuery(debouncedValue)
      .unwrap()
      .then((query) => {
        setUsers(query?.data || []);
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Error fetching users");
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoadingSearch(false);
      });
  }, [debouncedValue, searchQuery]);

  const handleAddUser = useCallback(
    async (user) => {
      if (loading) return;
      try {
        setLoading(true);
        const loadingToast = toast.loading(
          `Sending request to ${user.username}`
        );
        const res = await sendFriendRequest({ userId: user._id });
        toast.dismiss(loadingToast);
        if (res?.data?.success) {
          toast.success(`Request sent to ${user.username}`);
        } else {
          toast.error(res?.data?.message || "Already sent");
        }
      } catch (error) {
        toast.dismiss();
        toast.error(error?.data?.message || "Error occurred");
        console.error("Error sending friend request:", error);
      } finally {
        setLoading(false);
        setLoadingSearch(false);
      }
    },
    [loading, sendFriendRequest]
  );

  return (
    <motion.div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
      {...animations.zoomIn}
        className="bg-white p-6 rounded-2xl shadow-xl w-96"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4 rounded-full">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="absolute right-4 top-4"
          aria-label="Close search"
        >
          <X size={30} className="text-white" />
        </button>
        <div className="relative flex items-center mb-2 w-full max-w-md">
          <div className="flex w-full items-center gap-3">
            <input
              type="text"
              value={value}
              onChange={onChange}
              className="px-4 py-2 outline outline-1 outline-pink-500 pr-10 w-full bg-white text-gray-950 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              placeholder="Search..."
              aria-label="Search users"
            />
          </div>
          {value && (
            <button
              onClick={onClear}
              className="absolute right-3"
              aria-label="Clear search"
            >
              <AiOutlineClose className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>

        <div className="w-full relative shadow-md p-4 max-w-md bg-white rounded-lg">
          <div className="overflow-auto HideScrollbar space-y-2 max-h-60">
            {loadingSearch ? (
              <div className="flex items-center justify-center">
                <LoopIcon className="spin animate-spin duration-1000 w-5 h-5 text-gray-500" />
              </div>
            ) : users.length > 0
              ? users.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  size="sm"
                  handler={() => handleAddUser(user)}
                  disable={loading}
                />
              ))
              : loadingSearch ? (
                <div className="flex items-center justify-center">
                  <LoopIcon className="spin animate-spin duration-1000 w-5 h-5 text-gray-500" />
                </div>
              ) : (
                <p className="text-gray-500">No users found</p>
              )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(SearchBar);
