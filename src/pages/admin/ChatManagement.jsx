import React, { useState, useEffect } from "react";
import Table from "../../shared/Table";
import { Avatar, Stack } from "@mui/material";
import AvatarCard from "../../shared/AvatarCard";
import { useGetAllUsersChatsQuery } from "../../redux/api/api.js";
import { useError } from "../../hooks/hook.jsx";
import NewLoader from "../../components/NewLoader.jsx";
const ChatManagement = () => {

  const { data: chats, isLoading, isError, error } = useGetAllUsersChatsQuery();

  const errors = [
    {
      isError: isError,
      error: Error,
    },
  ];
  useError(errors);


  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "table-header",
      width: 250,
    },
    {
      field: "avatar",
      headerName: "Avatar",
      headerClassName: "table-header",
      width: 100,
      display: "flex",
      renderCell: (params) => {
        return <AvatarCard size="sm" avatar={params.row.members} />;
      },
    },

    {
      field: "name",
      headerName: "Name",
      headerClassName: "table-header",
      width: 200,
    },

    {
      field: "groupChat",
      headerName: "GroupChat",
      headerClassName: "table-header",
      width: 200,
    },
    {
      field: "totalMembers",
      headerName: "Total Members",
      headerClassName: "table-header",
      width: 120,
    },
    {
      field: "members",
      headerName: "Members",
      headerClassName: "table-header",
      width: 150,
      display: "flex",
      renderCell: (params) => {
        return <AvatarCard size="sm" avatar={params.row.members} />;
      },
    },
    {
      field: "totalMessages",
      headerName: "Total Messages",
      headerClassName: "table-header",
      width: 120,
    },
    {
      field: "creator",
      headerName: "Created By",
      headerClassName: "table-header",
      width: 250,
      display: "flex",
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={"1rem"}>
          <Avatar
            alt={params.row.creator.username}
            src={params.row.creator.avatar}
          />
          <span>{params.row.creator.username || "none"}</span>
        </Stack>
      ),
    },
  ];

  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      chats?.data?.allChats.map((chat) => ({
        id: chat._id,
        avatar: chat.avatar,
        name: chat.name,
        groupChat: chat.GroupChat,
        totalMembers: chat.members.length,
        members: chat.members.map((avatar) => avatar.avatar),
        totalMessages: chat.totalMessages,
        creator: chat.creator,
      }))
    )
  }, [chats]);

  return isLoading ? <NewLoader /> : (
    <Table heading={"All Users"} columns={columns} rows={rows} />
  );
};

export default ChatManagement;
