import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Badge, Box } from "@mui/material";
import { motion } from "framer-motion";
import Avatar from "./AvatarCard.jsx";
import AvatarCard from "./AvatarCard.jsx";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessage,
  handlerDeleteChat,
  date,
  index,
  isMobileView,
}) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: "-50%" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/chat/${_id}`}
        onContextMenu={(e) => handlerDeleteChat(e, _id, groupChat)}
        className={`flex items-center gap-4 p-2  transition-all shadow-md 
          ${
            sameSender
              ? "bg-gray-300 text-gray-800 hover:bg-gray-200"
              : "bg-white text-black hover:bg-gray-100"
          }
        `}
      >
        <AvatarCard
          avatar={avatar}
          size="sm"
          key={index}
          name={name}
          isOnline={isOnline}
        />
        <div
          className={`justify-between items-center w-[11rem] md:w-56 ${
            isMobileView ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="">
            <p className="text-base font-semibold truncate">{name}</p>
            {date && <p className="text-xs text-gray-500">{date}</p>}
          </div>
          {newMessage?.count > 0 && (
            <Box className="bg-green-500 w-5 h-5 items-center text-white flex justify-center rounded-full">
              {newMessage.count}
            </Box>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default memo(ChatItem);
