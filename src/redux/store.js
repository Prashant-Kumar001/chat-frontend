import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import misc from "./reducers/misc";
import api from "./api/api";
import chat from "./reducers/chat"
import admin from "./reducers/admin"

const store = configureStore({
  reducer: {
    auth: authReducer,
    misc: misc,
    chat: chat,
    admin: admin,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;