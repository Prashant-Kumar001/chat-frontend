import ApiClient from "./apiClient";
import { API_BASE_URL } from "../config";

const api = new ApiClient(API_BASE_URL);

const Api = {
  request: async (method, endpoint, data = {}, headers = {}) => {
    return api.request(method, endpoint, data, headers);
  },

  registerUser: (userData) => api.request("post", "/api/v1/auth/register", userData),
  loginUser: (credentials) => api.request("post", "/api/v1/auth/login", credentials),
  getUserProfile: () => api.request("get", "/api/v1/auth/profile"),

  getAllUsers: () => api.request("get", "/api/v1/users"),
  getUserById: (userId) => api.request("get", `/api/v1/users/${userId}`),
  updateUser: (userId, userData) =>
    api.request("put", `/users/${userId}`, userData),
  deleteUser: (userId) => api.request("delete", `/api/v1/users/${userId}`),
};

export default Api;
