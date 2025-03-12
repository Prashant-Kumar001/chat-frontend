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
  isMobileView
}) => {
<<<<<<< HEAD
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
          ${sameSender
            ? "bg-gray-300 text-gray-800 hover:bg-gray-200"
            : "bg-white text-black hover:bg-gray-100"
          }
        `}
      >
        <AvatarCard avatar={avatar} size="sm" key={index} name={name} isOnline={isOnline} />
        <div className={`justify-between items-center w-36 md:w-56 px-5 ${isMobileView ? 'flex' : 'hidden md:flex'}`}>
          <div className="">
            <p className="text-base font-semibold truncate">{name}</p>
            {date && <p className="text-xs text-gray-500">{date}</p>}
          </div>
          {newMessage?.count > 0 && <Box className="bg-green-500 w-5 h-5 items-center text-white flex justify-center rounded-full" >{newMessage.count}</Box>}
        </div>
      </Link>
    </motion.div>
  );
=======
    return (
        <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Link
                to={`/chat/${_id}`}
                onContextMenu={(e) => handlerDeleteChat(e, _id, groupChat)}
                className={`flex items-center p-2 md:p-3 md:rounded-lg transition-all md:shadow-md 
          ${sameSender ? "bg-gray-950 text-white hover:bg-gray-900" : "bg-white text-black hover:bg-gray-100"}`}
            >
                <Avatar avatar={avatar} name={name} size="sm" isOnline={isOnline} />
                <div className="hidden sm:flex flex-1 ml-3 overflow-hidden rounded-lg p-2">
                    <div className="flex-1">
                        <p className="text-[14px] font-semibold truncate">{name}</p>
                        <p className="text-sm dark:text-gray-400 truncate max-w-xs">{LastMessage}</p>
                    </div>
                    {newMessage?.count > 0 && (
                        <Badge
                            badgeContent={newMessage.count}
                            color="error"
                            sx={{ marginRight: 3, marginTop: 2 }}
                        />
                    )}
                </div>
            </Link>
        </motion.div>
    );
>>>>>>> 3371cc471f6621a74319fc2a09376a94b4117ad7
};

export default memo(ChatItem);
