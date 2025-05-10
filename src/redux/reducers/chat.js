import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constant/event";

const storedRequest = localStorage.getItem(NEW_REQUEST);
const parsedRequest = storedRequest ? JSON.parse(storedRequest) : {}; 

const initialState = {
  notificationsCount: parsedRequest.count || 0, 
  newMessageALertNotify: getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, get: true }) || [
    {
      chatID: "",
      count: 0,
    },
  ],
};


const Chat = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    increment: (state) => {
      state.notificationsCount += 1;
    },
    reset: (state) => {
      state.notificationsCount = 0;
    },
    setNewMessagesAlert: (state, action) => {
      const index = state.newMessageALertNotify.findIndex(
        (s) => s.chatID === action.payload.chatId
      );

      if (index !== -1) {
        state.newMessageALertNotify[index].count += 1;
      } else {
        state.newMessageALertNotify.push({
          chatID: action.payload.chatId,
          count: 1,
        });
      }
    },
    removeNewMessageAlert: (state, action) => {
      state.newMessageALertNotify = state.newMessageALertNotify.filter(
        (item) => item.chatID !== action.payload
      );
    },
  },
});

export const { increment, reset, setNewMessagesAlert, removeNewMessageAlert } = Chat.actions;
export default Chat.reducer;
