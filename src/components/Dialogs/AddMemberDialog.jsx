import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UserItem from "../../shared/UserItem";
import { UserRoundX, XIcon } from "lucide-react";
import Icon from "../../shared/IconBtn.jsx";
import { Button, Skeleton } from "@mui/material";
import toast from "react-hot-toast";
import {
  useAddUserInGroupMutation,
  useAvailableFriendsQuery,
  useChatDetailsQuery,
} from "../../redux/api/api.js";
import { Cancel } from "@mui/icons-material";
import { useError } from "../../hooks/hook.jsx";

const AddMemberDialog = ({ handleClose, icon, chatId }) => {
  const [members, setMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { data: friends, isError, error, isFetching, isLoading } = useAvailableFriendsQuery();
  const groupDetails = useChatDetailsQuery(
    { chatId: chatId, populate: true },
    { skip: !chatId }
  );
  
  useError([{ isError, error }, { isError: groupDetails.isError, error: groupDetails.error }]);

  useEffect(() => {
    if (friends) {
      setMembers(
        friends?.data?.map((item) => ({
          _id: item._id,
          username: item.username,
          avatar: item.avatar,
        }))
      );
    }
  }, [friends]);

  const alreadyAddedMembers = groupDetails?.data?.data?.members || [];
  const [addUserInGroup] = useAddUserInGroupMutation();

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user._id)
        ? prev.filter(({ id }) => id !== user._id)
        : [...prev, { id: user._id, username: user.username, chatId: chatId }]
    );
  };

  const handleSubmit = () => {
    if (selectedUsers.length === 0) return toast.error("Please select at least one member.");
    
    const userIds = selectedUsers.map((user) => user.id);
    const toastId = toast.loading("Adding members...");
    
    addUserInGroup({ chatId, members: userIds })
      .unwrap()
      .then(() => {
        toast.success("User(s) added successfully");
        setSelectedUsers([]);
      })
      .catch((error) => toast.error(error?.data?.message))
      .finally(() => {
        toast.dismiss(toastId);
        handleClose();
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white flex flex-col gap-4 p-6 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold text-gray-900">Add Members</h2>
          <Icon onClick={handleClose} icon={<XIcon size={24} />} title="Close" />
        </div>
        
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto HideScrollbar">
          {isLoading ? <Skeleton height={40} width="100%" /> : members.length === 0 ? (
            <p className="text-gray-500 text-sm">No available members.</p>
          ) : (
            members.map((item) => (
              <UserItem
                key={item._id}
                user={item}
                size="sm"
                disabled={alreadyAddedMembers.some((u) => u._id === item._id)}
                handler={() => handleSelectUser(item)}
                addIcon={selectedUsers.some((u) => u.id === item._id) ? <UserRoundX size={20} color="red" /> : icon}
              />
            ))
          )}
        </div>
        
        {selectedUsers.length > 0 && (
          <div className="bg-gray-100 p-3 rounded-lg">
            <h3 className="text-gray-600 text-sm font-medium">Selected Members</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedUsers.map((item) => (
                <div key={item.id} className="flex items-center bg-white gap-2 px-3 py-1 rounded-md border">
                  <p className="text-sm text-gray-700">{item.username}</p>
                  <Cancel fontSize="small" sx={{ color: "red", cursor: "pointer" }} onClick={() =>
                    setSelectedUsers(selectedUsers.filter((user) => user.id !== item.id))
                  }/>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleClose} variant="outlined" color="error" size="small">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" size="small">Add to Group</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddMemberDialog;
