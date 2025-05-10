import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import React from "react";
import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api.js";
import { useMutationAsyncMutation } from "../../hooks/hook.jsx";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();
  const { isDeleteMenu, isSelectedDeleteChat } = useSelector(
    (state) => state.misc
  );
  const [leaveGroup] = useLeaveGroupMutation();
  const [deleteChat] = useDeleteChatMutation();
  const { executeMutation: leaveGroupMutation, loading: leaveGroupLoading } =
    useMutationAsyncMutation(leaveGroup);
  const { executeMutation: deleteChatMutation, loading: deleteChatLoading } =
    useMutationAsyncMutation(deleteChat);

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const deleteChatHandler = () => {
    deleteChatMutation({
      payload: isSelectedDeleteChat.chatId,
      loadingMessage: "Deleting chat...",
      successMessage: "Chat deleted successfully!",
      errorMessage: "Error deleting chat.",
      onSuccess: () => {
        closeHandler();
        navigate("/");
      },
    });
  };

  const leaveGroupHandler = () => {
    leaveGroupMutation({
      payload: isSelectedDeleteChat.chatId,
      loadingMessage: "Leaving group...",
      successMessage: "Left group successfully!",
      errorMessage: "Error leaving group.",
      onSuccess: () => {
        closeHandler();
        navigate("/");
      },
    });
  };

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{ vertical: "center", horizontal: "right" }}
      transformOrigin={{ vertical: "center", horizontal: "right" }}
    >
      <MenuItem
        onClick={
          isSelectedDeleteChat?.groupChat
            ? leaveGroupHandler
            : deleteChatHandler
        }
      >
        <ListItemIcon>
          {isSelectedDeleteChat?.groupChat ? (
            <ExitToAppIcon color="error" />
          ) : (
            <DeleteIcon color="error" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            isSelectedDeleteChat?.groupChat ? "Leave Group" : "Delete Chat"
          }
        />
      </MenuItem>
    </Menu>
  );
};

export default DeleteChatMenu;
