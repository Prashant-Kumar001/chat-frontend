import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { useInfiniteScrollTop } from "6pp";
import AppLayout from "../layout/AppLayout";
import { MdOutlineAttachFile } from "react-icons/md";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc.js";

import { Skeleton, IconButton } from "@mui/material";
import { useSocket } from "../Socket";
import {
  TYPING,
  NEW_MESSAGE,
  STOP_TYPING,
  CHAT_JOINED,
  CHAT_LEAVED,
  ALERT,
} from "../constant/event.js";
import {
  useChatDetailsQuery,
  useGetMyMessagesQuery,
} from "../redux/api/api.js";
import Message from "../shared/Message.jsx";
import { useError } from "../hooks/hook.jsx";
import FileMenu from "../components/Dialogs/FileMenu.jsx";
import { removeNewMessageAlert } from "../redux/reducers/chat.js";
import { TypingIndicator } from "../components/Loader.jsx";
import { useNavigate } from "react-router-dom";
import MessageInput from "../shared/MessageInput.jsx";

const Chat = ({ chatId, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFileMenu } = useSelector((state) => state.misc);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const timeoutTyping = useRef(null);
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [iamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [currentUserTyping, setCurrentUserTyping] = useState('');

  const {
    data: Chat,
    isLoading,
    isError,
    error,
  } = useChatDetailsQuery({ chatId }, { skip: !chatId });

  const oldMessagesChunks = useGetMyMessagesQuery({ chatId, page });
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunks.data?.metadata?.totalPages,
    page,
    setPage,
    oldMessagesChunks.data?.data?.messages
  );

  const errors = [
    { isError, error },
    { isError: oldMessagesChunks.isError, error: oldMessagesChunks.error, fallback: () => navigate("/") },
  ];

  const members = Chat?.data?.members;
  let allMessages = [...(oldMessages || []), ...messages];

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleClick = (event) => {
    dispatch(setIsFileMenu(true));
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    dispatch(setIsFileMenu(false));
    setAnchorEl(null);
  };

  const sendMessage = (e) => {
    setMessage(e.target.value);
    if (!iamTyping) {
      socket.emit(TYPING, { chatId, members, user });
      setIamTyping(true);
    }
    if (timeoutTyping.current) clearTimeout(timeoutTyping.current);
    timeoutTyping.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { chatId, members });
      setIamTyping(false);
    }, 1000);
  };

  const isUserTyping = useCallback(
    (data) => {
      if (data?.members.length > 2) setCurrentUserTyping(data.name);
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopUserTyping = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
      setCurrentUserTyping('');
    },
    [chatId]
  );

  const messageForAlert = useCallback((content) => {
    setMessages((prev) => [
      ...prev,
      {
        content,
        sender: { _id: "admin", name: "Admin" },
        chat: chatId,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [chatId]);

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.error("Please enter a message");
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const newMessageHandler = useCallback(
    (data) => {
      if (chatId !== data.chatId) return;
      setMessages((prev) => [...prev, data.message]); 
    },
    [chatId]
  );

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId));
    socket.emit(CHAT_JOINED, { user: user._id, members });
    return () => {
      setMessage("");
      setMessages([]);
      setPage(1);
      setOldMessages([]);
      socket.emit(CHAT_LEAVED, { user: user._id, members });
    };
  }, [chatId, members, dispatch, socket]);

  useEffect(() => {
    socket.on(TYPING, isUserTyping);
    return () => socket.off(TYPING, isUserTyping);
  }, [isUserTyping, socket]);

  useEffect(() => {
    socket.on(STOP_TYPING, stopUserTyping);
    return () => socket.off(STOP_TYPING, stopUserTyping);
  }, [stopUserTyping, socket]);

  useEffect(() => {
    socket.on(ALERT, messageForAlert);
    return () => socket.off(ALERT, messageForAlert);
  }, [messageForAlert, socket]);

  useEffect(() => {
    socket.on(NEW_MESSAGE, newMessageHandler);
    return () => socket.off(NEW_MESSAGE, newMessageHandler);
  }, [newMessageHandler, socket]);

  useError(errors);

  return isLoading || oldMessagesChunks.isLoading ? (
    <Skeleton />
  ) : (
    <div className="flex flex-col h-full">
      <div ref={containerRef} className="overflow-y-scroll h-[79vh]">
        {allMessages.map((msg) => (
          <Message key={msg._id} message={msg} user={user} />
        ))}
        {userTyping && <TypingIndicator currentUserTyping={currentUserTyping} />}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center p-3">
        <IconButton onClick={handleClick}>
          <MdOutlineAttachFile color="white" />
        </IconButton>
        <FileMenu handleClose={handleClose} anchorEl={anchorEl} open={isFileMenu} chatId={chatId} />
        <MessageInput message={message} setMessage={sendMessage} handleMessageSend={handleMessageSend} />
      </div>
    </div>
  );
};

export default AppLayout()(Chat);
