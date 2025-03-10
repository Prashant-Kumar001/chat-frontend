import { Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAcceptFriendRequestMutation,
  useGetMyNotificationsQuery,
} from "../redux/api/api";
import { Avatar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useError } from "../hooks/hook";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { animations } from "../lib/features.js";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { reset } from "../redux/reducers/chat.js";
import { NEW_REQUEST } from "../constant/event.js";

export default function Notifications({ onClose }) {
  const dispatch = useDispatch()
  const { data, isLoading, refetch, isError, error, isFetching } =
    useGetMyNotificationsQuery();
  const notifications = data?.data || [];
  useError([{ isError, error }]);

  const [acceptRequest] = useAcceptFriendRequestMutation();

  const handlerRequest = ({ requestId, status, username }) => {
    toast.promise(
      new Promise((resolve, reject) => {
        acceptRequest({ requestId, status })
          .unwrap()
          .then((data) => {
            if (data?.success) {
              resolve(`${status}`);
            } else {
              reject(`${status}`);
            }
          })
          .catch((error) =>
            reject(`Failed to ${status} request: ${error.message}`)
          )
          .finally(() => refetch());
      }),
      {
        loading: `Processing request for user ${username}...`,
        success: (message) => message,
        error: (message) => message,
      }
    );
  };

  const closeHandler = () => {
    onClose()
    dispatch(reset())
    const updatedValue = {
                userId: null,
                count: 0
              };
              localStorage.setItem(NEW_REQUEST, JSON.stringify(updatedValue));
  }

  return (
    <motion.div
      {...animations.div}
      className="absolute z-50 top-[60px] right-10 w-96 p-3 rounded-xl shadow-lg bg-white border border-gray-200"
      elevation={3}
    >
      <motion.div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <div className="flex items-center gap-2">
          <IconButton onClick={refetch} disabled={isLoading || !data?.success}>
            <RefreshIcon
              className={`cursor-pointer ${isLoading || isFetching ? "animate-spin" : ""
                }`}
            />
          </IconButton>
          <IconButton onClick={closeHandler}>
            <CloseIcon />
          </IconButton>
        </div>
      </motion.div>
      {isLoading || isFetching ? (
        <Box>
          <Skeleton height={50} className="mb-2" />
          <Skeleton height={50} animation="wave" />
        </Box>
      ) : notifications?.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No new notifications</p>
      ) : (
        <div className="space-y-3">
          <Box className="space-y-2">
            {notifications.map((notification) => (
              <Notification
                requestHandler={handlerRequest}
                key={notification?._id}
                {...notification}
              />
            ))}
          </Box>
        </div>
      )}
    </motion.div>
  );
}

const Notification = ({ _id, sender, createdAt, requestHandler }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-2 border border-gray-200 transition">
      <div className="flex items-center gap-3">
        <Avatar
          alt={sender?.name}
          src={sender?.avatar?.secure_url}
          className="w-10 h-10"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 font-medium text-sm">
            {sender?.username}{" "}
            <span className="text-gray-500 font-light text-xs">
              sent you a friend request
            </span>
          </h1>
          <span className="text-gray-400 text-xs">
            {moment(createdAt).fromNow()}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        <IconButton
          size="small"
          color="success"
          onClick={() =>
            requestHandler({
              requestId: _id,
              status: "accepted",
              username: sender?.username,
            })
          }
        >
          <Check className="w-4 h-4" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() =>
            requestHandler({
              requestId: _id,
              status: "rejected",
              username: sender?.username,
            })
          }
        >
          <X className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  );
};
