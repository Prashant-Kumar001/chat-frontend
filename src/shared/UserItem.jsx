import React, { useState, memo } from "react";
import AvatarCard from "./AvatarCard.jsx";
import { RiAddLargeFill } from "react-icons/ri";
import { Avatar } from "@mui/material";
import { transformFile } from "../lib/features.js";
const UserItem = ({
  user,
  handler,
  size = "md",
  addIcon,
  border = false,
  textColor = "text-gray-900",
  hover = true,
  disabled = false,
  className=""
}) => {



  return (
    <div
      className={`flex items-center ${className} justify-between p-2 ${textColor}  rounded-lg ${border ? "border" : "border-none"
        }  transition duration-200 ${hover ? "hover:bg-gray-200" : ""}`}
    >
      <div className="flex items-center gap-3 w-full">
        <AvatarCard avatar={[user?.avatar?.secure_url]} name={user.username} size={size} />
        <div className="flex flex-col flex-grow">
          <h3 className={"text-black font-semibold"}>{user.username}</h3>
        </div>
      </div>
      <div>
        <button
          className={`flex items-center ${disabled ? "cursor-not-allowed" : ""} justify-center p-2 rounded-md transition disabled:opacity-50`}
          onClick={handler}
          disabled={disabled}
          aria-label="Add user"
        >
          {addIcon ? addIcon : <RiAddLargeFill />}
        </button>
      </div>
    </div>
  );
};

export default memo(UserItem);
