import ApiClient from "./apiClient";
import { API_BASE_URL } from "../config";

const api = new ApiClient(API_BASE_URL);

const Api = {
  // Generic API request handler
  request: async (method, endpoint, data = {}, headers = {}) => {
    return api.request(method, endpoint, data, headers);
  },

  // ✅ Authentication APIs
  registerUser: (userData) => api.request("post", "/auth/register", userData),
  loginUser: (credentials) => api.request("post", "/auth/login", credentials),
  getUserProfile: () => api.request("get", "/auth/profile"),

  // ✅ User APIs
  getAllUsers: () => api.request("get", "/users"),
  getUserById: (userId) => api.request("get", `/users/${userId}`),
  updateUser: (userId, userData) =>
    api.request("put", `/users/${userId}`, userData),
  deleteUser: (userId) => api.request("delete", `/users/${userId}`),
};

export default Api;
