import React, { useEffect } from "react";
import Table from "../../shared/Table";
import { Avatar, Stack } from "@mui/material";
import moment from "moment";
import { fileFormat } from "../../lib/features.js";
import { Box } from "@mui/system";
import renderAttachment from "../../components/RenderAttachment.jsx";
import { useGetAllUsersMessagesQuery } from "../../redux/api/api.js";
import NewLoader from "../../components/NewLoader.jsx";

const MessageManagement = () => {
  const {
    data: messagess,
    isLoading,
    isError,
    error,
  } = useGetAllUsersMessagesQuery();
  const errors = [
    {
      isError: isError,
      error: Error,
    },
  ];


const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "table-header",
      width: 250,
    },
    {
      field: "attachment",
      headerName: "attachment",
      headerClassName: "table-header",
      width: 250,
      display: "flex",
      renderCell: (params) => {
        const { attachment } = params.row;
        return attachment?.length > 0
          ? attachment.map((att, i) => {
              const url = att;
              const file = fileFormat(url);
              return (
                <Box key={i}>
                  <a href={url} target="_blank" download>
                    {renderAttachment(file, url, attachment?.description)}
                  </a>
                </Box>
              );
            })
          : "no attachments";
      },
    },
    {
      field: "content",
      headerName: "content",
      headerClassName: "table-header",
      width: 250,
    },

    {
      field: "sender",
      headerName: "Sent By",
      headerClassName: "table-header",
      width: 200,
      display: "flex",
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" spacing={"1rem"}>
            <Avatar
              alt={params.row.sender.name}
              src={params.row.sender.avatar}
            />
            <span>{params.row.sender.username}</span>
          </Stack>
        );
      },
    },
    {
      field: "chat",
      headerName: "Chat",
      headerClassName: "table-header",
      width: 300,
    },
,
    {
      field: "groupChat",
      headerName: "groupChat",
      headerClassName: "table-header",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "time",
      headerClassName: "table-header",
      width: 250,
    },
];

  const messages = [
    {
      id: 1,
      attachment: ["https://ik.imagekit.io/ikmedia/backlit.jpg"],
      content: "Hello, How are you?",
      sender: {
        name: "John Doe",
        avatar: ["https://via.placeholder.com/50"],
      },
      friends: ["Alice", "Bob", "Charlie"],
      chat: "John Doe",
      groupChat: false,
      createdAt: "2022-01-10 12:30:00",
    },
    {
      id: 2,
      attachment: [],
      content: "I'm fine, thanks for asking.",
      sender: {
        name: "Alice",
        avatar: ["https://via.placeholder.com/50"],
      },
      friends: ["John Doe", "Bob", "Charlie"],
      chat: "John Doe",
      groupChat: false,
      createdAt: "2022-01-10 12:35:00",
    },
  ];

  const [row, setRow] = React.useState([]);
  useEffect(() => {
    if (messages) {
      setRow(
        messagess?.data?.transformMessages?.map((message) => ({
          ...messagess,
          id: message._id,
          sender: message.sender,
          content: message.content,
          chat: message.chat?._id,
          groupChat: message.chat?.groupChat,
          createdAt: message.createdAt
        }))
      );
    }
  }, [messagess]);

  return isLoading ? <NewLoader/> : (
      <Table columns={columns} rows={row} heading={"messages"} />
  );
};

export default MessageManagement;
