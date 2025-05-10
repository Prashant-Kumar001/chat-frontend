import React, { memo } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { fileFormat, animations } from "../lib/features.js";
import { Box } from "@mui/material";
import RenderAttachment from "../shared/RenderAttachment";


const Message = ({ message, user }) => {
  const sameSender = user?._id === message?.sender?._id;
  const timeAgo = moment(message?.createdAt).fromNow();

  return (
    <div className="flex flex-col px-4 py-2">
      <motion.div
        key={message?.chat}
        {...animations.div}
        className={`flex ${sameSender ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[75%] flex flex-col px-4 py-3 gap-2 rounded-lg shadow-md text-gray-900 ${sameSender ? "bg-blue-200" : "bg-green-200"} `}
        >
          {!sameSender && (
            <span className="text-xs font-semibold text-green-700">
              {message?.sender?.name}
            </span>
          )}
          {message?.content ? (
            <p className="text-sm p_font">{message?.content}</p>
          ) : (
            message?.attachments?.map((img, index) => {
              const url = img.secure_url;
              const format = fileFormat(url);

              return (
                <Box key={index}>
                  <a
                    href={url}
                    target="_blank"
                    download
                    style={{
                      color: "black",
                    }}
                  >
                    {RenderAttachment(format, url)}
                  </a>
                </Box>
              );
            })
          )}
          <span className="text-[10px] text-gray-800 self-end">{timeAgo}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(Message);

