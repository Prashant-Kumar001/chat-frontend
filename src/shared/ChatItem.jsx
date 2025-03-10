import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@mui/material";
import { motion } from "framer-motion";
import formatTimestamp from "../utils/timeConvert.js";
import Avatar from "./AvatarCard.jsx";

const ChatItem = ({
    avatar = [],
    name,
    _id,
    LastMessage,
    groupChat = false,
    sameSender,
    isOnline,
    newMessage,
    handlerDeleteChat,
    date,
    index,
}) => {
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
                            sx={{ marginRight: 3 }}
                        />
                    )}
                </div>
            </Link>
        </motion.div>
    );
};

export default memo(ChatItem);