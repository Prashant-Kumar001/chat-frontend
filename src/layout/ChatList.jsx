import React from "react";
import ChatItem from "../shared/ChatItem";
import { motion } from "framer-motion"
import { animations } from "../lib/features";

const ChatList = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessageAlert = [
    {
      chatID: "",
      count: 0,
    },
  ],
  handlerDeleteChat,
  width,
}) => {
  return (
    <motion.div className={` ${width} h-full flex flex-col gap-2 md:gap-0  m_font`}>
      {
        chats.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center font-semibold text-center">
            <h1 className="md:text-2xl">add friend and start chatting</h1>
          </div>
        )
      }
      {chats.map((chat, index) => {
        const { avatar, name, _id, groupChat, members, date } = chat;

        const isOnline = members?.some((member) => onlineUsers.includes(member))

        const newMessage = newMessageAlert?.find(
          ({ chatID }) => chatID === _id
        );

        return (
          <ChatItem
            index={index}
            newMessage={newMessage}
            isOnline={isOnline}
            avatar={avatar}
            key={_id}
            name={name}
            _id={_id}
            groupChat={groupChat}
            sameSender={chatId == _id}
            handlerDeleteChat={handlerDeleteChat}
            date={date}
          />
        );
      })}
    </motion.div>
  );
};

export default ChatList;
