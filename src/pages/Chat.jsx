import React, { useState, useEffect, useCallback, useRef } from "react";
import { useInfiniteScrollTop } from "6pp";
import AppLayout from "../layout/AppLayout";
import { MdOutlineAttachFile } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc.js";

import { Skeleton, Button } from "@mui/material";
import { useSocket } from "../Socket.jsx";
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


const ChatMessagesSkeleton = () => {
  const placeholders = new Array(16).fill(0);

  return (
    <div className="flex flex-col gap-3 p-4 w-full h-full overflow-y-auto animate-pulse">
      {placeholders.map((_, index) => (
        <div
          key={index}
          className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`rounded-2xl px-4 py-2 ${
              index % 2 === 0
                ? 'bg-gray-300 dark:bg-gray-700'
                : 'bg-blue-400 dark:bg-blue-600'
            } w-[60%] h-5`}
          />
        </div>
      ))}
    </div>
  );
};


const Chat = ({ chatId, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFileMenu } = useSelector((state) => state.misc);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [iamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [userName, setUser] = useState('')
  const timeoutTyping = useRef(null);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
    return () => {
      clearTimeout(scrollToBottom);
    };
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
      socket.emit(TYPING, { chatId, members, username: user?.username });
      setIamTyping(true);
    }
    if (timeoutTyping.current) clearTimeout(timeoutTyping.current);
    timeoutTyping.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { chatId, members, username: user?.username });
      setIamTyping(false);
      setUser('')
    }, 1000);
  };

  const isUserTyping = useCallback(
    (data) => {
      if (data?.members.length > 2) setUser(data.username)
      if (data.chatId !== chatId) return;
      setUserTyping((prev) => !prev);
    },
    [chatId]
  );

  const stopUserTyping = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping((prev) => !prev);
    },
    [chatId]
  );

  const messageForAlert = useCallback((content) => {
    const AlertMessage = {
      content,
      sender: {
        _id: 'djhsjhdfkjshdkfhsd',
        name: "admin",
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, AlertMessage]);
  }, [chatId]);

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId));
    socket.emit(CHAT_JOINED, { user: user._id, members });
    return () => {
      setMessage("");
      setMessages([]);
      setPage(1);
      setOldMessages([]);
      setUser('')
      socket.emit(CHAT_LEAVED, { user: user._id, members });
    };
  }, [chatId, members]);


  useEffect(() => {
    socket.on(TYPING, isUserTyping);
    return () => socket.off(TYPING, isUserTyping);
  }, [isUserTyping]);

  useEffect(() => {
    socket.on(STOP_TYPING, stopUserTyping);
    return () => socket.off(STOP_TYPING, stopUserTyping);
  }, [stopUserTyping]);

  useEffect(() => {
    socket.on(ALERT, messageForAlert);
    return () => socket.off(ALERT, messageForAlert);
  }, [messageForAlert]);

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.error("Please enter a message");
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const newMessageHandler = useCallback(
    (data) => {
      if (chatId !== data.chatId) return;
      if (data?.message) setMessages((prev) => [...prev, data.message]);
    },
    []
  );

  useEffect(() => {
    socket.on(NEW_MESSAGE, newMessageHandler);
    return () => socket.off(NEW_MESSAGE, newMessageHandler);
  }, [newMessageHandler]);

  useError(errors);

  return isLoading ? (
    <div className="flex items-center  h-full">
      <Skeleton
        variant="rectangular"
        width={1000}
        height={1000}
        className="rounded-lg"
      />
    </div>
  ) : (
    <div className="flex flex-col h-full bg-gray-100">
      <div
        ref={containerRef}
        className="overflow-y-scroll h-[79vh] flex flex-col gap-4  "
      >
        {oldMessagesChunks.isLoading ? (
          <ChatMessagesSkeleton />
        ) : allMessages.length > 0 ? (
          allMessages.map((msg, index) => (
            <Message key={msg._id} message={msg} user={user} />
          ))
        ) : (
          <div className="h-[77vh] flex items-center justify-center">
            <h1 className="text-xl font-semibold text-center ">
              No messages
            </h1>
          </div>
        )}
        {
          userTyping &&
          <TypingIndicator username={userName} />
        }
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center gap-3 p-3  rounded-lg mt-2">
        <Button onClick={handleClick}>
          <MdOutlineAttachFile size={25} className="rotate-45 text-gray-700" />
        </Button>
        <FileMenu
          handleClose={handleClose}
          anchorEl={anchorEl}
          open={isFileMenu}
          chatId={chatId}
        />
        <form className="flex-1" onSubmit={handleMessageSend}>
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-200 rounded-full outline-none"
            value={message}
            onChange={sendMessage}
            placeholder="Type a message..."
          />
        </form>
        <button
          type="submit"
          className="bg-orange-500 p-2 rounded-full  hover:bg-orange-600"
          onClick={handleMessageSend}
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default AppLayout()(Chat);
