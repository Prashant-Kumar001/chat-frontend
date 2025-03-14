import React, { useEffect } from "react";
import Table from "../../shared/Table";
import { Avatar, Stack } from "@mui/material";
import moment from "moment";
import { fileFormat } from "../../lib/features.js";
import { Box, height } from "@mui/system";
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
      height: 100,
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




  const [row, setRow] = React.useState([]);
  useEffect(() => {
    if (messagess) {
      setRow(
        messagess?.data?.transformMessages?.map((message) => ({
          ...messagess,
          id: message._id,
          attachment: message.attachments ? message.attachments.map((att) => att.secure_url) : [],
          sender: message.sender,
          content: message.content,
          chat: message.chat?._id,
          groupChat: message.chat?.groupChat,
          createdAt: moment(message.createdAt).fromNow()
        }))
      );
    }
  }, [messagess]);

  return isLoading ? <NewLoader/> : (
      <Table columns={columns} rows={row} heading={"messages"} />
  );
};

export default MessageManagement;
