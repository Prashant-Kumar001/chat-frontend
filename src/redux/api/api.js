import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/api/v1/` }),
  tagTypes: ["Chat", "User", "Messages"],
  endpoints: (builder) => ({
    myChat: builder.query({
      query: () => ({
        url: "chat/my",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (searchTerm) => ({
        url: `user/search?name=${searchTerm}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => {
        return {
          url: "user/request",
          method: "POST",
          credentials: "include",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => {
        return {
          url: "user/acceptRequest",
          method: "PUT",
          credentials: "include",
          body: data,
        };
      },
      invalidatesTags: ["Chat"],
    }),
    getMyNotifications: builder.query({
      query: () => ({
        url: "user/notification",
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `/chat/${chatId}`;
        if (populate) {
          url += `?populate=${populate}`;
        }
        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    getMyMessages: builder.query({
      query: ({ chatId, page = 1 }) => {
        const url = `chat/message/${chatId}?page=${page}`;
        return {
          url,
          method: "GET",
          credentials: "include",
        };
      },
      keepUnusedDataFor: 0,
    }),
    sendAttachment: builder.mutation({
      query: (data) => {
        return {
          url: "chat/attachment",
          method: "POST",
          credentials: "include",
          body: data,
        };
      },
    }),
    getMyGroups: builder.query({
      query: () => ({
        url: "chat/my/groups",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    availableFriends: builder.query({
      query: (chatId) => {
        let url = `user/friends`;
        if (chatId) url += `?chatId=${chatId}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    createGroup: builder.mutation({
      query: ({ name, members }) => {
        return {
          url: "chat",
          method: "POST",
          credentials: "include",
          body: { name, members },
        };
      },
      invalidatesTags: ["Chat"],
    }),
    changeGroupName: builder.mutation({
      query: ({ chatId, newGroupName }) => {
        return {
          url: `chat/${chatId}`,
          method: "PUT",
          credentials: "include",
          body: { newGroupName },
        };
      },
      invalidatesTags: ["Chat"],
    }),
    addUserInGroup: builder.mutation({
      query: ({ chatId, members }) => {
        return {
          url: `chat/add`,
          method: "PUT",
          credentials: "include",
          body: { chatId, members },
        };
      },
      invalidatesTags: ["Chat"],
    }),
    DeleteGroupUser: builder.mutation({
      query: ({ chatId, userId }) => {
        return {
          url: `chat/remove`,
          method: "PUT",
          credentials: "include",
          body: { chatId, userId },
        };
      },
      invalidatesTags: ["Chat"],
    }),
    DeleteChat: builder.mutation({
      query: (chatId) => {
        return {
          url: `chat/${chatId}`,
          method: "DELETE",
          credentials: "include",
        };
      },
      invalidatesTags: ["Chat"],
    }),
    leaveGroup: builder.mutation({
      query: (chatId) => {
        return {
          url: `chat/leave/${chatId}`,
          method: "DELETE",
          credentials: "include",
        };
      },
      invalidatesTags: ["Chat"],
    }),
    getDashboard: builder.query({
        query: () => {
          const url = `admin/stats`;
          return {
            url,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags: ["Dashboard"],
      }),
    getAllUsers: builder.query({
        query: () => {
          const url = `admin/users`;
          return {
            url,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags: ["Users"],
      }),
    getAllUsersMessages: builder.query({
        query: () => {
          const url = `admin/messages`;
          return {
            url,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags: ["Messages"],
      }),
    getAllUsersChats: builder.query({
        query: () => {
          const url = `admin/chats`;
          return {
            url,
            method: "GET",
            credentials: "include",
          };
        },
        providesTags: ["chats"],
      }),
  }),
});

export default api;
export const {
  useMyChatQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetMyNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMyMessagesQuery,
  useSendAttachmentMutation,
  useGetMyGroupsQuery,
  useAvailableFriendsQuery,
  useCreateGroupMutation,
  useChangeGroupNameMutation,
  useAddUserInGroupMutation,
  useDeleteGroupUserMutation,
  useDeleteChatMutation,
  useLeaveGroupMutation,
  useGetDashboardQuery,
  useGetAllUsersQuery,
  useGetAllUsersMessagesQuery,
  useGetAllUsersChatsQuery,
} = api;
