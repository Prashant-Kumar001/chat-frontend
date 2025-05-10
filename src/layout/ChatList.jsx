import React from "react";
import ChatItem from "../shared/ChatItem";
import { motion } from "framer-motion";

const ChatList = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessageAlert = [],
  handlerDeleteChat,
  width = "w-full",
  isLoading = false,
  isError = false,
  error = null,
}) => {

  const ChatListSkeleton = () => {
  const skeletonItems = new Array(6).fill(0);

  return (
    <div className="flex flex-col gap-4 p-2 animate-pulse overflow-y-auto h-full">
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm"
        >
          {/* Avatar Placeholder */}
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />

          {/* Text Content */}
          <div className="flex flex-col flex-1 gap-2">
            <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-500 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

  if (isLoading) {
    return (
      <ChatListSkeleton />
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>{error?.message || "An error occurred while loading chats."}</p>
      </div>
    );
  }

  return (
    <motion.div className={`${width} h-full flex flex-col gap-2 md:gap-0 m_font`}>
      {chats.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center font-semibold text-center">
          <h1 className="md:text-2xl">Add a friend and start chatting</h1>
        </div>
      ) : (
        chats.map((chat, index) => {
          const { avatar, name, _id, groupChat, members, date } = chat;

          const isOnline = members?.some((member) => onlineUsers.includes(member));
          const newMessage = newMessageAlert.find(({ chatID }) => chatID === _id);

          return (
            <ChatItem
              key={_id}
              index={index}
              avatar={avatar}
              name={name}
              _id={_id}
              groupChat={groupChat}
              isOnline={isOnline}
              newMessage={newMessage}
              sameSender={chatId === _id}
              handlerDeleteChat={handlerDeleteChat}
              date={date}
            />
          );
        })
      )}
    </motion.div>
  );
};

export default ChatList;
