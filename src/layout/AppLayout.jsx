import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  Fragment,
  useRef,
} from "react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsDeleteMenu, setIsMobileView, setIsSelectedDeleteChat } from "../redux/reducers/misc";
import { increment, setNewMessagesAlert } from "../redux/reducers/chat.js";
import Drawer from "@mui/material/Drawer";

const ChatList = React.lazy(() => import("../layout/ChatList"));
const Profile = React.lazy(() => import("../layout/Profile"));

import { useMyChatQuery } from "../redux/api/api.js";
import { useError, useSocketEvents } from "../hooks/hook.jsx";
import { Grid2, Skeleton } from "@mui/material";
import { useSocket } from "../Socket";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
  ONLINE_USER,
  ALERT,
} from "../constant/event.js";
import { getOrSaveFromStorage } from "../lib/features.js";
import DeleteChatMenu from "../components/Dialogs/OpenDeleteChat.jsx";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const { _id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deleteMenuAnchor = useRef(null);
    const socket = useSocket();

    const { isMobileView } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessageALertNotify } = useSelector((state) => state.chat);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const {
      data: myChats,
      isLoading,
      isError,
      error,
      refetch,
    } = useMyChatQuery();

    useError([{ isError, error }]);

    useEffect(() => {
      if (newMessageALertNotify !== undefined) {
        getOrSaveFromStorage({
          key: NEW_MESSAGE_ALERT,
          value: newMessageALertNotify,
        });
      }
    }, [newMessageALertNotify]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      e.preventDefault();
      dispatch(setIsDeleteMenu(true));
      dispatch(setIsSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => {
      dispatch(setIsMobileView(false));
    };

    const newRequestListener = useCallback(
      (data) => {
        if (data) {
          dispatch(increment());
          const storedValue = JSON.parse(localStorage.getItem(NEW_REQUEST)) || {};
          const updatedValue = {
            userId: data.userId,
            count: (storedValue.count || 0) + 1,
          };
          localStorage.setItem(NEW_REQUEST, JSON.stringify(updatedValue));
        }
      },
      [dispatch]
    );


    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === _id) return;
        dispatch(setNewMessagesAlert(data));
      },
      [dispatch, _id]
    );

    const refetchListener = useCallback(
      (data) => {
        refetch();

      },
      [refetch, navigate, socket]
    );

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = useMemo(
      () => ({
        [NEW_MESSAGE_ALERT]: newMessageAlertListener,
        [NEW_REQUEST]: newRequestListener,
        [REFETCH_CHATS]: refetchListener,
        [ONLINE_USER]: onlineUsersListener,
      }),
      [
        newMessageAlertListener,
        newRequestListener,
        refetchListener,
        onlineUsersListener,
      ]
    );

    useEffect(() => {
      if (socket) {
        socket.on(ALERT, (data) => {
          console.log(data);
        });
      }
    }, [socket]);

    useSocketEvents(socket, eventHandlers);

    return (
      <Fragment>
        <Header />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {isLoading ? (
          <Skeleton
            variant="rectangular"
            sx={{
              height: "100%",
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: 2,
            }}
          />
        ) : (
          <Drawer
            open={isMobileView}
            onClose={handleMobileClose}
            disableEnforceFocus={true}
            aria-label="Chat list drawer"
            role="dialog"
            sx={{
              "& .MuiDrawer-paper": {
                borderRight: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          >
            <ChatList
              chats={myChats?.data}
              chatId={_id}
              newMessageAlert={newMessageALertNotify}
              handlerDeleteChat={handleDeleteChat}
              onlineUsers={onlineUsers}
              chatID={_id}
            />
          </Drawer>
        )}

        <Grid2
          container
          className="flex-1 overflow-hidden"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "70px 1fr",
              sm: "350px 1fr",
              md: "350px 1fr 300px",
            },
            gap: 1,
            p: 1,
            height: "calc(100vh - 65px)",
          }}
        >
          <Grid2
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "rgba(243, 244, 246)",
            }}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" sx={{ height: "100%" }} />
            ) : isError ? (
              <Skeleton variant="rectangular" sx={{ height: "100%" }} />
            ) : (
              <ChatList
                chats={myChats?.data}
                chatId={_id}
                newMessageAlert={newMessageALertNotify}
                handlerDeleteChat={handleDeleteChat}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid2>
          <Grid2
            sx={{
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <WrappedComponent {...props} chatId={_id} user={user} />
          </Grid2>
          <Grid2
            sx={{
              display: { xs: "none", md: "block" },
              borderRadius: 2,
              p: 2,
              overflow: "hidden",
              backgroundColor: "rgba(243, 244, 246)",

            }}
          >
            <Profile user={user} />
          </Grid2>
        </Grid2>
      </Fragment>
    );
  };
};

export default AppLayout;
