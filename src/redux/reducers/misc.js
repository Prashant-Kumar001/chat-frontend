import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroups: false,
    isAddMember: false,
    isNotification: false,
    isMobileView: false,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu: false,
    isUploadingLoader: false,
    isSelectedDeleteChat: {
        chatId: "",
        groupChat: false,
    },
};

const misc = createSlice({
    name: "misc",
    initialState,
    reducers: {
        setIsNewGroup: (state, action) => {
            state.isNewGroups = action.payload;
        },
        setIsAddMember: (state, action) => {
            state.isAddMember = action.payload;
        },
        setIsNotification: (state, action) => {
            state.isNotification = action.payload;
        },
        setIsMobileView: (state, action) => {
            state.isMobileView = action.payload;
        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload;
        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload;
        },
        setIsDeleteMenu: (state, action) => {
            state.isDeleteMenu = action.payload;
        },
        setIsUploadingLoader: (state, action) => {
            state.isUploadingLoader = action.payload;
        },
        setIsSelectedDeleteChat: (state, action) => {
            state.isSelectedDeleteChat = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setIsNewGroup,
    setIsAddMember,
    setIsNotification,
    setIsMobileView,
    setIsSearch,
    setIsFileMenu,
    setIsDeleteMenu,
    setIsUploadingLoader,
    setIsSelectedDeleteChat,
    setLoading,
} = misc.actions;
export default misc.reducer;
