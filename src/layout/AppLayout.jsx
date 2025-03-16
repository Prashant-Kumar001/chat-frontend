import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  lazy,
  useCallback,
  Suspense,
} from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Drawer from "@mui/material/Drawer";
import { Grid2, Skeleton } from "@mui/material";
import Header from "../components/Header";
import { useMyChatQuery } from "../redux/api/api.js";
import { useError } from "../hooks/hook.jsx";
import { getOrSaveFromStorage } from "../lib/features.js";
import { useSocket } from "../Socket";
import { setMobileProfileView } from "../redux/reducers/misc";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
  ONLINE_USER,
} from "../constant/event.js";
import {
  setIsDeleteMenu,
  setIsMobileView,
  setIsSelectedDeleteChat,
} from "../redux/reducers/misc";
import { increment, setNewMessagesAlert } from "../redux/reducers/chat";
import NewLoader from "../components/NewLoader.jsx";

const ChatList = lazy(() => import("../layout/ChatList"));
const Profile = lazy(() => import("../layout/Profile"));
const DeleteChatMenu = lazy(() =>
  import("../components/Dialogs/OpenDeleteChat.jsx")
);

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const { _id } = useParams();
    const dispatch = useDispatch();
    const deleteMenuAnchor = useRef(null);
    const socket = useSocket();

    const { isMobileView, mobileProfileView } = useSelector(
      (state) => state.misc
    );
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

    const handleDeleteChat = useCallback(
      (e, chatId, groupChat) => {
        e.preventDefault();
        dispatch(setIsDeleteMenu(true));
        dispatch(setIsSelectedDeleteChat({ chatId, groupChat }));
        deleteMenuAnchor.current = e.currentTarget;
      },
      [dispatch]
    );

    const handleMobileClose = () => {
      dispatch(setIsMobileView(false));
    };

    useEffect(() => {
      if (!socket) return;

      const handleNewMessageAlert = (data) => {
        if (data?.chatId === _id) return;
        dispatch(setNewMessagesAlert(data));
      };

      const handleNewRequest = (data) => {
        dispatch(increment());
        const storedValue =
          JSON.parse(sessionStorage.getItem(NEW_REQUEST)) || {};
        const updatedValue = {
          userId: data.userId,
          count: (storedValue.count || 0) + 1,
        };
        sessionStorage.setItem(NEW_REQUEST, JSON.stringify(updatedValue));
      };

      const handleRefetchChats = () => {
        refetch();
      };

      const handleOnlineUsers = (data) => {
        setOnlineUsers(data);
      };

      socket.on(NEW_MESSAGE_ALERT, handleNewMessageAlert);
      socket.on(NEW_REQUEST, handleNewRequest);
      socket.on(REFETCH_CHATS, handleRefetchChats);
      socket.on(ONLINE_USER, handleOnlineUsers);

      socket.on("disconnect", () => {
        setTimeout(() => socket.connect(), 3000);
      });

      return () => {
        socket.off(NEW_MESSAGE_ALERT, handleNewMessageAlert);
        socket.off(NEW_REQUEST, handleNewRequest);
        socket.off(REFETCH_CHATS, handleRefetchChats);
        socket.off(ONLINE_USER, handleOnlineUsers);
      };
    }, [socket, dispatch, refetch, _id]);

    return (
      <Fragment>
        <Header />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />
        {mobileProfileView && (
          <Suspense fallback={<NewLoader />}>
            <Profile
              mobileView={true}
              onBack={() => dispatch(setMobileProfileView(false))}
            />
          </Suspense>
        )}
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
            disableEnforceFocus
            aria-label="Chat list drawer"
          >
            <ChatList
              chats={myChats?.data}
              chatId={_id}
              newMessageAlert={newMessageALertNotify}
              handlerDeleteChat={handleDeleteChat}
              onlineUsers={onlineUsers}
              chatID={_id}
              width="300px"
              isMobileView={isMobileView}
            />
          </Drawer>
        )}

        <Grid2
          container
          className="flex-1 overflow-hidden bg-gray-950 text-gray-200"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "80px 1fr",
              sm: "350px 1fr",
              md: "350px 1fr 300px",
            },
            gap: 1,
            p: 1,
            height: "calc(100vh - 64px)",
          }}
        >
          <Grid2
            className="text-gray-100"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "rgb(229, 231, 235)",
            }}
          >
            {isLoading || isError ? (
              <Skeleton variant="rectangular" sx={{ height: "100%" }} />
            ) : (
              <ChatList
                chats={myChats?.data}
                chatId={_id}
                newMessageAlert={newMessageALertNotify}
                handlerDeleteChat={handleDeleteChat}
                onlineUsers={onlineUsers}
                width="100%"
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
            className="bg-gray-900 text-gray-100"
            sx={{
              display: { xs: "none", md: "block" },
              borderRadius: 2,
              p: 2,
              overflow: "hidden",
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
