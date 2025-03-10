import React, { useState } from "react";
import UserItem from "../shared/UserItem";
import { UserRoundPlus, UserRoundX } from "lucide-react";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { Button, CircularProgress, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { animations } from "../lib/features.js";
import { useAvailableFriendsQuery } from "../redux/api/api.js";
import { useError, useMutationAsyncMutation } from "../hooks/hook.jsx";
import { useCreateGroupMutation } from "../redux/api/api.js";

const NewGroup = ({ onClose }) => {
  const { data, isError, error, isLoading } = useAvailableFriendsQuery();
  const [newGroup] = useCreateGroupMutation();
  const { executeMutation, loading } = useMutationAsyncMutation(newGroup);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  useError([{ isError: isError, error: error }]);

  const handleAddToGroup = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const cancelCreateGroup = () => {
    setGroupName("");
    setSelectedUsers([]);
    onClose();
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return toast.error("Please enter a group name");
    if (selectedUsers.length < 2)
      return toast.error("Group must have at least 2 members");

    executeMutation({
      payload: {
        name: groupName,
        members: selectedUsers.map((user) => user._id),
      },
      loadingMessage: "Creating group...",
      successMessage: "Group created successfully!",
      errorMessage: "Error creating group.",
      onSuccess: () => {
        setGroupName("");
        setSelectedUsers([]);
        onClose();
      },
    });
  };

  return (
    <motion.div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        {...animations.zoomIn}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Group</h2>
          <MdClose
            size={22}
            className="cursor-pointer hover:rotate-90 transition-transform duration-300"
            onClick={onClose}
          />
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Group Name"
            className="w-full p-2 rounded-lg border placeholder-gray-400 focus:outline-none"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        {selectedUsers.length > 0 && (
          <div className="bg-gray-100 p-3 rounded-lg mb-4">
            <h3 className="text-gray-600 text-sm font-medium">
              Selected Members
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center bg-white gap-2 px-3 py-1 rounded-md border"
                >
                  <p className="text-sm text-gray-700">{user.username}</p>
                  <MdClose
                    className="text-red-500 cursor-pointer"
                    onClick={() =>
                      setSelectedUsers(
                        selectedUsers.filter((u) => u._id !== user._id)
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="max-h-64 overflow-y-auto HideScrollbar space-y-2">
          {isLoading ? (
            <Skeleton height={40} width="100%" />
          ) : (
            data?.data?.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={() => handleAddToGroup(user)}
                addIcon={
                  selectedUsers.some((u) => u._id === user._id) ? (
                    <UserRoundX size={20} color="red" />
                  ) : (
                    <UserRoundPlus size={20} color="green" />
                  )
                }
                hover={true}
                textColor="text-gray-100"
                size="md"
              />
            ))
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={cancelCreateGroup}
            variant="outlined"
            color="error"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            color="primary"
            disabled={!groupName || groupName.length <= 3 || loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewGroup;
