import React from "react";
import ChatItem from "../shared/ChatItem";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { setMobileProfileView } from "../redux/reducers/misc";
import { useDispatch } from "react-redux";
const ChatList = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessageAlert = [],
  handlerDeleteChat,
  width = "250px",
  isMobileView,
}) => {
  const dispatch = useDispatch();
  return (
    <motion.div
      style={{ width: width, height: "100%" }}
      className="m_font bg-gray-100 shadow-lg flex flex-col "
    >
      <div className="flex items-center justify-between border-b border-gray-300">
        <IconButton
          onClick={() => dispatch(setMobileProfileView(true))}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <AccountCircleIcon
            fontSize="large"
            sx={{
              color: "black",
            }}
          />
        </IconButton>
      </div>

      <div className="w-full ">
        {chats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-sm md:text-3xl font-semibold text-center p-4">
            <h1>Add friend and start chatting</h1>
          </div>
        ) : (
          chats.map((chat, index) => {
            const { avatar, name, _id, groupChat, members, date } = chat;
            const isOnline = members?.some((member) =>
              onlineUsers.includes(member)
            );
            const newMessage = newMessageAlert?.find(
              ({ chatID }) => chatID === _id
            );
            return (
              <ChatItem
                key={_id}
                index={index}
                newMessage={newMessage}
                isOnline={isOnline}
                avatar={avatar}
                name={name}
                _id={_id}
                groupChat={groupChat}
                sameSender={chatId === _id}
                handlerDeleteChat={handlerDeleteChat}
                date={date}
                isMobileView={isMobileView}
              />
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default ChatList;
